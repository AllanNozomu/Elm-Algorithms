module View exposing (view)

import Array
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block
import Bootstrap.Grid as Grid
import Bootstrap.Grid.Col as Col
import Bootstrap.ListGroup as Listgroup
import Bootstrap.Modal as Modal
import Bootstrap.Navbar as Navbar
import Bootstrap.Utilities.Spacing as Spacing
import Html exposing (..)
import Html.Attributes exposing (src)
import Html.Events exposing (..)
import Model exposing (Model, SortType(..))
import Svg
import Svg.Attributes exposing (..)
import Update exposing (Msg(..))


getColor index barHeight model =
    if index == model.currentLeft then
        fill "red"

    else if index == model.currentRight then
        fill "yellow"

    else if (model.orderedList |> Array.fromList |> Array.get index |> Maybe.withDefault 0) == barHeight then
        fill "green"

    else
        fill "black"


svgRect index barHeight model =
    let
        bigger =
            model.sortType == SelectionSort
    in
    Svg.rect
        [ x <|
            String.fromInt <|
                (index
                    * (if bigger then
                        8

                       else
                        2
                      )
                )
        , y <|
            String.fromInt
                ((512
                    - barHeight
                    * (if bigger then
                        4

                       else
                        1
                      )
                 ) - 4
                )
        , width <|
            if bigger then
                "8"

            else
                "2"
        , getColor index barHeight model
        , height <|
            String.fromInt <|
                barHeight
                    *  (if bigger then
                            4

                           else
                            2
                          )
                    + 4
        ]
        []


view : Model -> Html Msg
view model =
    div []
        [ Grid.container []
            [ Grid.row []
                [ Grid.col []
                    [ h1 [] [ text <| if model.sortType == MergeSort then "Merge sort" else "Selection Sort"]
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
                    ]
                ]
            , Grid.row []
                [ Grid.col []
                    [ Button.button [ Button.onClick Roll ,Button.attrs [ Spacing.ml1 ]] [ text "Shuffle" ]
                    , Button.button
                        [ Button.onClick <|
                            ChangeSort <|
                                if model.sortType == MergeSort then
                                    SelectionSort

                                else
                                    MergeSort
                        ,Button.attrs [ Spacing.ml1 ]]
                        [ text <|
                            if model.sortType == MergeSort then
                                "SelectionSort"

                            else
                                "MergeSort"
                        ]
                    ,Button.button
                        [ Button.onClick Back, Button.disabled (model.index <= 0),Button.attrs [ Spacing.ml1 ] ]
                        [ text "<" ]
                    , Button.button [ Button.onClick Pause, Button.disabled model.pause ,Button.attrs [ Spacing.ml1 ]] [ text "Pause" ]
                    , Button.button [ Button.onClick Continue, Button.disabled <| not model.pause ,Button.attrs [ Spacing.ml1 ]] [ text "Continue" ]
                    , Button.button [ Button.onClick Advance, Button.disabled (model.index >= List.length model.steps) ,Button.attrs [ Spacing.ml1 ]] [ text ">" ]
                    ]
                ]
            ]
        ]
