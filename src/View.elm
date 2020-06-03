module View exposing (view)

import Array
import Html exposing (..)
import Html.Attributes exposing (src)
import Html.Events exposing (..)
import Svg
import Svg.Attributes exposing (..)
import Model exposing (Model)
import Update exposing (Msg(..))

view : Model -> Html Msg
view model =
    let
        getColor index barHeight =
            if index == model.currentLeft then
                fill "red"

            else if index == model.currentRight then
                fill "yellow"

            else if (model.orderedList |> Array.fromList |> Array.get index |> Maybe.withDefault 0 ) == barHeight then
                fill "green"
            else
                fill "black"
    in
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
                    Svg.rect
                        [ x <| String.fromInt <| index * 2
                        , y <| String.fromInt (512 - barHeight * 1)
                        , width "2"
                        , getColor index barHeight
                        , height <| String.fromInt <| barHeight * 1
                        ]
                        []
                )
                model.currentStep
            )
        , button [ onClick Roll ] [ text "Shuffle" ]
        , button [ onClick Back, Html.Attributes.disabled (model.index <= 0) ] [ text "<" ]
        , button [ onClick Pause, Html.Attributes.disabled model.pause ] [ text "Pause" ]
        , button [ onClick Continue, Html.Attributes.disabled <| not model.pause ] [ text "Continue" ]
        , button [ onClick Advance, Html.Attributes.disabled (model.index >= List.length model.steps) ] [ text ">" ]
        ]
