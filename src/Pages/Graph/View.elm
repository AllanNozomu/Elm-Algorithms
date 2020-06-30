module Pages.Graph.View exposing (view)

import Algorithms.Graphs.MazeGenerator exposing (Tile(..), mazeToString)
import Array
import Canvas exposing (..)
import Canvas.Settings exposing (..)
import Color
import Css exposing (..)
import Html.Attributes
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))
import Utils.IconUtils exposing (toStyledHtml)


whiteColorAttr =
    Canvas.Settings.fill (Color.rgba 255 255 255 1)


blackColortAttr =
    Canvas.Settings.fill (Color.rgba 0 0 0 1)


colorAttr tile =
    case tile of
        Free ->
            whiteColorAttr

        Occupied ->
            blackColortAttr


drawLine lineIndex line =
    Array.indexedMap
        (\index tile ->
            shapes [ colorAttr tile ]
                [ rect ( toFloat index * 16, toFloat lineIndex * 16 ) 16 16 ]
        )
        line
        |> Array.toList


drawMazeFromListEdges =
    List.map
        (\{ from, to } ->
            let
                x =
                    Basics.min from.x to.x |> (+) 1 |>  toFloat

                y =
                    Basics.min from.y to.y |> (+) 1 |> toFloat

                width =
                    if from.x == to.x then
                        14 

                    else
                        14 * 2 + 2

                height =
                    if from.x == to.x then
                        14 * 2 + 2

                    else
                        14 
            in
            shapes [ whiteColorAttr ]
                [ rect ( x * 16, y * 16 ) width height ]
        )


view : Model -> Html Msg
view model =
    div []
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ h1 []
                    [ Html.Styled.text <| "Maze" ]
                , div
                    [ css
                        [ displayFlex
                        , alignItems center
                        , justifyContent center
                        , margin (px 5)
                        , width (pct 100)
                        ]
                    ]
                    [ Html.Styled.fromUnstyled <|
                        Canvas.toHtml ( 1024, 1024 )
                            [ Html.Attributes.style "border" "1px solid black" ]
                            (shapes [ blackColortAttr ]
                                [ rect ( 0, 0 ) 1024 1024 ] 
                                :: drawMazeFromListEdges model.path
                            )

                    -- (Array.indexedMap drawLine model.maze |> Array.toList |> List.concat)
                    ]
                ]
            ]
        ]
