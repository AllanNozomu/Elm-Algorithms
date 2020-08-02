module Pages.Graph.View exposing (view)

import Algorithms.Graphs.MazeGenerator exposing (Tile(..), mazeToString)
import Array
import Color
import Css exposing (..)
import Html.Attributes
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy
import Utils.IconUtils exposing (toStyledHtml)
import Dict

edgeSize = 16

svgSize = "512"

whiteColorAttr =
    SvgAttrs.fill "white"

blueCollorAttr =
    SvgAttrs.fill "blue"

redCollorAttr =
    SvgAttrs.fill "red"

greenCollorAttr =
    SvgAttrs.fill "lightgreen"

blackColortAttr =
    SvgAttrs.fill "black"

drawMazeFromListEdges path beginEndPath isPath visited =
    let
        drawRect from to = 
            let
                x =
                    Basics.min from.x to.x + 1

                y =
                    Basics.min from.y to.y + 1

                middle = edgeSize // 2

                (width, height) =
                    if isPath then
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
                SvgAttrs.x  <| String.fromInt (x * edgeSize + (if isPath then middle - 1 else 0)),
                SvgAttrs.y  <| String.fromInt (y * edgeSize + (if isPath then middle - 1 else 0)),
                SvgAttrs.width <| String.fromFloat width,
                SvgAttrs.height <| String.fromFloat height,
                if not isPath 
                    then whiteColorAttr 
                    else if Maybe.withDefault 0 (Dict.get ((from.x, from.y), (to.x, to.y)) visited) == 0 then blueCollorAttr
                    else if List.member {from=from, to=to} beginEndPath then greenCollorAttr
                    else redCollorAttr
                ]
            []
    in
    Svg.svg [
        SvgAttrs.width svgSize,
        SvgAttrs.height svgSize
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
                        , width (pct 50)
                        ]
                        ,HtmlAttributes.id "canvaAnimation"
                    ]
                    [ Svg.svg
                        [ SvgAttrs.width "100%"
                        , SvgAttrs.height "100%"
                        , SvgAttrs.viewBox "0 0 512 512"
                        ]
                        [   Svg.rect [
                                SvgAttrs.width svgSize,
                                SvgAttrs.height svgSize
                            ][],
                            -- drawMazeFromListEdges model.path False,
                            drawMazeFromListEdges model.maze [] False Dict.empty,
                            drawMazeFromListEdges model.drawedSteps model.beginEndPath True model.drawed
                        ]
                    ]
                ]
            ]
        ]
