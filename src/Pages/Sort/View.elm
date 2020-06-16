module Pages.Sort.View exposing (view)

import Array
import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Pages.Sort.Model exposing (Model, SortType(..))
import Pages.Sort.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy


getColor index barHeight left right =
    if index == left then
        SvgAttrs.fill "red"

    else if index == right then
        SvgAttrs.fill "yellow"

    else if index == barHeight then
        SvgAttrs.fill "green"

    else
        SvgAttrs.fill "black"


svgRect2 index barHeight left right qty =
    let
        h =
            512 // qty

        w =
            1024 // qty
    in
    Svg.rect
        [ SvgAttrs.x <|
            String.fromInt <|
                (index * w)
        , SvgAttrs.y <|
            String.fromInt (512 - (barHeight + 1) * h)
        , SvgAttrs.width <| String.fromInt w
        , SvgAttrs.height <|
            String.fromInt <|
                (barHeight + 1)
                    * h
        , getColor index barHeight left right
        ]
        []


svgRect : Int -> Int -> Int -> ( Int, Int ) -> ( String, Svg.Svg Msg )
svgRect index barHeight qty ( currentLeft, currentRight ) =
    ( String.fromInt index, SvgLazy.lazy5 svgRect2 index barHeight currentLeft currentRight qty )


view : Model -> Html Msg
view model =
    let
        listToBeSorted =
            if Array.isEmpty model.currentStep then
                Array.fromList model.listToBeSorted

            else
                model.currentStep

        ( inputMin, inputMax ) =
            if model.sortType == SelectionSort then
                ( "1", "64" )

            else
                ( "1", "256" )
    in
    div []
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ h1 []
                    [ text <|
                        if model.sortType == MergeSort then
                            "Merge sort"

                        else
                            "Selection Sort"
                    ]
                , h2 [] [ text <| String.fromInt model.listLength ++ " Elementos" ]
                , input
                    [ type_ "range"
                    , class "form-control-range"
                    , HtmlAttributes.min inputMin
                    , HtmlAttributes.max inputMax
                    , step "1"
                    , onInput ChangeLength
                    , value <| String.fromInt model.listLength
                    ]
                    []
                , h2 [] [ text <| String.fromInt model.index ++ " Steps" ]
                , div
                    [ css
                        [ displayFlex
                        , alignItems center
                        , justifyContent center
                        , margin (px 5)
                        , width (pct 100)
                        ]
                    ]
                    [ SvgKeyed.node "svg"
                        [ SvgAttrs.width "100%"
                        , SvgAttrs.height "100%"
                        , SvgAttrs.viewBox "0 0 1024 512"
                        ]
                        (Array.indexedMap
                            (\index barHeight ->
                                svgRect index barHeight (Array.length listToBeSorted) ( model.currentLeft, model.currentRight )
                            )
                            listToBeSorted
                            |> Array.toList
                        )
                    ]
                ]
            ]
        , div [ class "row" ]
            [ div [ class "col" ]
                [ button [ onClick Roll, class "btn mx-1 btn-dark" ] [ text "Shuffle" ]

                -- <input type="range" class="form-control-range" id="formControlRange">
                , button [ onClick Back, HtmlAttributes.disabled (model.index <= 0), class "btn mx-1 btn-dark" ] [ text "<" ]
                , button [ onClick Pause, HtmlAttributes.disabled model.pause, class "btn mx-1 btn-dark" ] [ text "Pause" ]
                , button [ onClick Continue, HtmlAttributes.disabled <| not model.pause, class "btn mx-1 btn-dark" ] [ text "Continue" ]
                , button [ onClick Advance, HtmlAttributes.disabled (model.index >= Array.length model.steps || Array.isEmpty model.steps), class "btn mx-1 btn-dark" ] [ text ">" ]
                ]
            ]
        ]
