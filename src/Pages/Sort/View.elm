module Pages.Sort.View exposing (view)

import Array
import Css exposing (..)
import FeatherIcons
import Canvas exposing (..)
import Canvas.Settings exposing (..)
import Color
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Html.Styled.Keyed as HtmlKeyed
import Html.Styled.Lazy as HtmlLazy
import Pages.Sort.Model exposing (Model, SortType(..))
import Pages.Sort.Update exposing (Msg(..))
import Utils.IconUtils exposing (toStyledHtml)


whiteColorAttr =
    Canvas.Settings.fill (Color.rgb 1 1 1)

getColor i bh l r =
    if i == l then
        Canvas.Settings.fill (Color.rgb 1 0 0)

    else if i == r then
        Canvas.Settings.fill (Color.rgb 1 1 0)

    else if i == bh then
        Canvas.Settings.fill (Color.rgb 0 0.8 0)

    else
        Canvas.Settings.fill (Color.rgb 0 0 0)

drawRects listToBeSorted left right width =
    let
        qty = List.length listToBeSorted |> Basics.toFloat
        h =
            512 / qty

        w =
            width / qty

    in
    List.indexedMap(\index barHeight ->
        let
            floatBarHeight = Basics.toFloat barHeight
            floatIndex = Basics.toFloat index
        in
        shapes [getColor index barHeight left right][
            rect (floatIndex * w, 512 - (floatBarHeight + 1) * h) w ((floatBarHeight + 1) * h)
        ]
    ) listToBeSorted

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
                    [ Html.text <| String.fromFloat model.width ++ " Steps "
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
                    [ css
                        [ displayFlex
                        , alignItems center
                        , justifyContent center
                        , margin (px 5)
                        , width (pct 100)
                        ],
                        HtmlAttributes.id "canvaAnimation"
                    ]
                    [ Html.fromUnstyled <|
                        Canvas.toHtml ( Basics.round model.width, 512 )
                            []
                            (shapes [ whiteColorAttr ]
                                [ rect ( 0, 0 ) model.width 512 ] ::
                                drawRects currentStep model.currentLeft model.currentRight model.width
                            )
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
