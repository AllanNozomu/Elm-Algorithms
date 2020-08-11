module Pages.Maze.View exposing (view)

import Algorithms.Graphs.MazeGenerator exposing (Tile(..), mazeToString)
import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Pages.Maze.Model exposing (Model)
import Pages.Maze.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy
import Utils.IconUtils exposing (toStyledHtml)

svgSize_ = 512

edgeSize = svgSize_ // 32

whiteColorAttr =
    SvgAttrs.fill "white"

blueCollorAttr =
    SvgAttrs.fill "blue"

blackColortAttr =
    SvgAttrs.fill "black"

drawMazeFromListEdges path beginEnd =
    let
        drawRect from to = 
            let
                x =
                    Basics.min from.x to.x + 1

                y =
                    Basics.min from.y to.y + 1

                middle = edgeSize // 2

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
            Svg.rect [
                SvgAttrs.x  <| String.fromInt (x * edgeSize + (if beginEnd then middle - 1 else 0)),
                SvgAttrs.y  <| String.fromInt (y * edgeSize + (if beginEnd then middle - 1 else 0)),
                SvgAttrs.width <| String.fromInt width,
                SvgAttrs.height <| String.fromInt height,
                if beginEnd then blueCollorAttr else whiteColorAttr
                ]
            []
    in
    Svg.svg [
        SvgAttrs.width <| String.fromInt svgSize_,
        SvgAttrs.height <| String.fromInt svgSize_
    ]
    (List.map
        (\{ from, to } ->
            drawRect from to
        ) path
    )

view : Model -> Html Msg
view model =
    div []
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ h1 []
                    [ Html.Styled.text model.title ]
                , div
                    [ css
                        [ displayFlex
                        , alignItems center
                        , justifyContent center
                        ]
                        ,HtmlAttributes.id "canvaAnimation"
                    ]
                    [ Svg.svg
                        [ SvgAttrs.width <| String.fromInt svgSize_
                        , SvgAttrs.height <| String.fromInt svgSize_
                        , SvgAttrs.viewBox ([0, 0, svgSize_, svgSize_] |> List.map String.fromInt |> String.join " ")
                        ]
                        [   Svg.rect [
                                SvgAttrs.width <| String.fromInt svgSize_,
                                SvgAttrs.height <| String.fromInt svgSize_
                            ][],
                            drawMazeFromListEdges model.drawedSteps False
                        ]
                    ]
                ]
            ]
        ]
