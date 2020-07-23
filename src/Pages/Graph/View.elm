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
    Canvas.Settings.fill (Color.rgb 1 1 1 )

blueCollorAttr =
    Canvas.Settings.fill (Color.rgb 0 0 1 )

blackColortAttr =
    Canvas.Settings.fill (Color.rgb 0 0 0 )


colorAttr tile =
    case tile of
        Free ->
            whiteColorAttr

        Occupied ->
            blackColortAttr

calcCellLen path =
    List.length path |> Basics.toFloat |> Basics.sqrt

drawMazeFromListEdges edgeSize path beginEnd =
    shapes [  ]
    [  ]
    :: List.map
        (\{ from, to } ->
            let
                x =
                    Basics.min from.x to.x |> (+) 1 |>  toFloat

                y =
                    Basics.min from.y to.y |> (+) 1 |> toFloat

                middle = edgeSize / 2

                (width, height) =
                    if beginEnd then
                        if from.x == to.x then
                            (2, edgeSize + 1)

                        else
                            (edgeSize + 1 , 2)
                    else
                        if from.x == to.x then
                            (edgeSize - 2, (edgeSize - 2) * 2 + 2)

                        else
                            ((edgeSize - 2) * 2 + 2, edgeSize - 2)
                        
            in
            shapes [ if beginEnd then blueCollorAttr else whiteColorAttr  ]
                [ rect ( x * edgeSize + (if beginEnd then middle - 1 else 0), y * edgeSize + (if beginEnd then middle - 1 else 0)) width height ]
        ) path


view : Model -> Html Msg
view model =
    let
        cellLen = List.length model.path |> Basics.toFloat |> Basics.sqrt
        edgeSize = model.edgeLen / (cellLen + 2) |> Basics.floor |> Basics.toFloat

        canvaLen = edgeSize * (cellLen + 2)
    in
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
                            
                            (shapes [ blackColortAttr ]
                                
                                [ rect (0, 0) canvaLen canvaLen ] 
                                :: drawMazeFromListEdges edgeSize model.path False
                                ++ drawMazeFromListEdges edgeSize model.beginEndPath True
                            )
                    ]
                ]
            ]
        ]
