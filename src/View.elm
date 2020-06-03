module View exposing (view)

import Array
import Html exposing (..)
import Html.Attributes exposing (src)
import Html.Events exposing (..)
import Svg
import Svg.Attributes exposing (..)
import Model exposing (Model, SortType(..))
import Update exposing (Msg(..))

getColor index barHeight model =
    if index == model.currentLeft then
        fill "red"

    else if index == model.currentRight then
        fill "yellow"

    else if (model.orderedList |> Array.fromList |> Array.get index |> Maybe.withDefault 0 ) == barHeight then
        fill "green"
    else
        fill "black"

svgRect index barHeight model =
    let
        bigger = model.sortType == SelectionSort
    in 
    Svg.rect
    [ x <| String.fromInt <| (index * if bigger then 8 else 2)
    , y <| String.fromInt ((512 - barHeight * if bigger then 4 else 1) - 1)
    , width <| if bigger then "8" else "2"
    , getColor index barHeight model
    , height <| String.fromInt <| barHeight * (index * if bigger then 4 else 2) + 1
    ]
    []

view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Merge sort" ]
        , h1 [] [ text <| String.fromInt model.index ++ " Steps" ]
        , Svg.svg
            [ width "1024"
            , height "512"
            , viewBox "0 0 1024 512"
            ]
            (List.indexedMap
                (\index barHeight ->
                    svgRect index barHeight model
                )
                model.currentStep
            )
        , button [ onClick Roll ] [ text "Shuffle" ]
        , button [ onClick <| ChangeSort <| if model.sortType == MergeSort then SelectionSort else MergeSort ] [ text <| if model.sortType == MergeSort then "SelectionSort" else "MergeSort" ]
        , button [ onClick Back, Html.Attributes.disabled (model.index <= 0) ] [ text "<" ]
        , button [ onClick Pause, Html.Attributes.disabled model.pause ] [ text "Pause" ]
        , button [ onClick Continue, Html.Attributes.disabled <| not model.pause ] [ text "Continue" ]
        , button [ onClick Advance, Html.Attributes.disabled (model.index >= List.length model.steps) ] [ text ">" ]
        ]
