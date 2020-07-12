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


drawMazeFromListEdges edgeLen path =
    let
        cellLen = List.length path |> Basics.toFloat |> Basics.sqrt
        edgeSize = edgeLen / (cellLen + 2) |> Basics.round |> Basics.toFloat
    in
    shapes [ blackColortAttr ]
    [ rect (0, 0) (edgeSize * (cellLen + 2)) (edgeSize * (cellLen + 2)) ]
    :: List.map
        (\{ from, to } ->
            let
                x =
                    Basics.min from.x to.x |> (+) 1 |>  toFloat

                y =
                    Basics.min from.y to.y |> (+) 1 |> toFloat

                width =
                    if from.x == to.x then
                        edgeSize - 2

                    else
                        (edgeSize - 2) * 2 + 2

                height =
                    if from.x == to.x then
                        (edgeSize - 2) * 2 + 2

                    else
                        edgeSize - 2
            in
            shapes [ whiteColorAttr ]
                [ rect ( x * edgeSize, y * edgeSize ) width height ]
        ) path


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
                        ,HtmlAttributes.id "canvaAnimation"
                    ]
                    [ Html.Styled.fromUnstyled <|
                        Canvas.toHtml ( Basics.floor model.edgeLen, Basics.floor  model.edgeLen )
                            [ ]
                            (shapes [ ]
                                [] 
                                :: drawMazeFromListEdges model.edgeLen model.path
                            )
                    ]
                ]
            ]
        ]
