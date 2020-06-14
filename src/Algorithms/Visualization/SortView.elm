module Algorithms.Visualization.SortView exposing (view)

import Algorithms.Visualization.Model exposing (Model, SortType(..))
import Algorithms.Visualization.Update exposing (Msg(..))
import Array
import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, css)
import Html.Styled.Events exposing (onClick)
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


svgRect2 index barHeight left right sortType =
    let
        bigger =
            sortType == SelectionSort
    in
    Svg.rect
        [ SvgAttrs.x <|
            String.fromInt <|
                (index
                    * (if bigger then
                        8

                       else
                        2
                      )
                )
        , SvgAttrs.y <|
            String.fromInt
                ((512
                    - barHeight
                    * (if bigger then
                        4

                       else
                        1
                      )
                 )
                    - 4
                )
        , SvgAttrs.width <|
            if bigger then
                "8"

            else
                "2"
        , getColor index barHeight left right
        , SvgAttrs.height <|
            String.fromInt <|
                barHeight
                    * (if bigger then
                        4

                       else
                        2
                      )
                    + 4
        ]
        []


svgRect : Int -> Int -> Model -> ( String, Svg.Svg Msg )
svgRect index barHeight model =
    ( String.fromInt index, SvgLazy.lazy5 svgRect2 index barHeight model.currentLeft model.currentRight model.sortType )


view : Model -> Html Msg
view model =
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
                , h1 [] [ text <| String.fromInt model.index ++ " Steps" ]
                , div [ css [displayFlex, alignItems center, justifyContent center, margin (px 5) ] ]
                    [ SvgKeyed.node "svg"
                        [ SvgAttrs.width "1024"
                        , SvgAttrs.height "512"
                        , SvgAttrs.viewBox "0 0 1024 512"
                        ]
                        (Array.indexedMap
                            (\index barHeight ->
                                svgRect index barHeight model
                            )
                            model.currentStep
                            |> Array.toList
                        )
                    ]
                ]
            ]
        , div [ class "row" ]
            [ div[class "col"][ button [ onClick Roll, class "btn mx-1" ] [ text "Shuffle" ]
            , button
                [ onClick <|
                    ChangeSort <|
                        if model.sortType == MergeSort then
                            SelectionSort

                        else
                            MergeSort
                , class "btn mx-1"
                ]
                [ text <|
                    if model.sortType == MergeSort then
                        "SelectionSort"

                    else
                        "MergeSort"
                ]
            , button [ onClick Advance, Html.Styled.Attributes.disabled (model.index >= Array.length model.steps), class "btn mx-1 float-right" ] [ text ">" ]
            , button [ onClick Continue, Html.Styled.Attributes.disabled <| not model.pause, class "btn mx-1 float-right" ] [ text "Continue" ]
            , button [ onClick Pause, Html.Styled.Attributes.disabled model.pause, class "btn mx-1 float-right" ] [ text "Pause" ]
            , button [ onClick Back, Html.Styled.Attributes.disabled (model.index <= 0), class "btn mx-1 float-right" ] [ text "<" ]
            ]]
        ]
        