module Pages.Sort.View exposing (view)

import Array
import Css exposing (..)
import FeatherIcons
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Html.Styled.Keyed as HtmlKeyed
import Html.Styled.Lazy as HtmlLazy
import Pages.Sort.Model exposing (Model, SortType(..))
import Pages.Sort.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy
import Utils.IconUtils exposing (toStyledHtml)

width_ : Int
width_ = 512

height_ : Int
height_ = 256

getColor : Int -> Int -> Int -> Int -> Svg.Attribute Msg
getColor i bh l r =
    if i == l then
        SvgAttrs.fill "red"

    else if i == r then
        SvgAttrs.fill "yellow"

    else if i == bh then
        SvgAttrs.fill "green"

    else
        SvgAttrs.fill "black"


drawRects : List Int -> Int -> Int -> List (Svg.Svg Msg)
drawRects listToBeSorted left right =
    let
        qty =
            List.length listToBeSorted

        h =
            height_ // qty

        w =
            width_ // qty
    in
    List.indexedMap
        (\index barHeight ->
            Svg.rect
                [ SvgAttrs.x <| String.fromInt (index * w)
                , SvgAttrs.y <| String.fromInt (height_ - (barHeight + 1) * h)
                , SvgAttrs.width <| String.fromInt w
                , SvgAttrs.height <| String.fromInt ((barHeight + 1) * h)
                , getColor index barHeight left right
                ]
                []
        )
        listToBeSorted


showCode : String -> ( String, Html Msg )
showCode strCode =
    let
        f x =
            code [ class "elm" ] [ Html.text x ]
    in
    ( strCode, HtmlLazy.lazy f strCode )


view : Model -> Html Msg
view model =
    let
        currentStep =
            if Array.isEmpty model.steps then
                model.listToBeSorted

            else
                Array.toList model.currentStep

        { sortInfo } =
            model
    in
    div []
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ h1 []
                    [ Html.text <| sortInfo.sortName ]
                , h2 [] [ Html.text <| String.fromInt model.listLength ++ " Elements" ]
                , input
                    [ type_ "range"
                    , class "form-control-range"
                    , HtmlAttributes.min "1"
                    , HtmlAttributes.max <| String.fromInt <| sortInfo.maxLength
                    , step "1"
                    , onInput ChangeLength
                    , value <| String.fromInt model.listLength
                    ]
                    []
                , h2 []
                    [ Html.text <| String.fromInt model.index ++ " Steps "
                    , span
                        [ attribute "data-toggle" "tooltip"
                        , attribute "data-placement" "right"
                        , attribute "title" "This number is a estimate number only and does not reflect the real number of steps. I just generate all steps and iterate to create an animation."
                        ]
                        [ FeatherIcons.info
                            |> toStyledHtml
                        ]
                    ]
                , div
                    []
                    [ Svg.svg
                        [ SvgAttrs.width "100%"
                        , SvgAttrs.height "100%"
                        , SvgAttrs.viewBox ([0, 0, width_, height_] |> List.map String.fromInt |> String.join " ")
                        ]
                        (drawRects currentStep model.currentLeft model.currentRight)
                    ]
                ]
            ]
        , div [ class "row" ]
            [ div [ class "col" ]
                [ button [ onClick Shuffle, class "btn mx-1 btn-dark" ] [ Html.text "Shuffle" ]
                , button [ onClick Back, HtmlAttributes.disabled (model.index <= 0), class "btn mx-1 btn-dark" ] [ Html.text "<" ]
                , button [ onClick Pause, HtmlAttributes.disabled model.pause, class "btn mx-1 btn-dark" ] [ Html.text "Pause" ]
                , button [ onClick Continue, HtmlAttributes.disabled <| not model.pause, class "btn mx-1 btn-dark" ] [ Html.text "Continue" ]
                , button [ onClick Advance, HtmlAttributes.disabled (model.index >= Array.length model.steps || Array.isEmpty model.steps), class "btn mx-1 btn-dark" ] [ Html.text ">" ]
                ]
            ]
        , div [ class "row" ]
            [ div [ class "col" ]
                [ h2 []
                    [ Html.text "Code "
                    , span
                        [ attribute "data-toggle" "tooltip"
                        , attribute "data-placement" "right"
                        , attribute "title" "The steps above is not implemented using the code below. it implements a messy code in the repository. Check it out ;D"
                        ]
                        [ FeatherIcons.info
                            |> toStyledHtml
                        ]
                    ]
                , HtmlKeyed.node "pre" [] [ showCode model.code ]
                ]
            ]
        ]
