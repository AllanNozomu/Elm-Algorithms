module Pages.Graph.View exposing (view)

import Algorithms.Graphs.MazeGenerator exposing (Tile(..), mazeToString, Position)
import Array
import Css exposing (..)
import Html.Attributes
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Events as SvgEvents
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy
import Utils.IconUtils exposing (toStyledHtml)
import Dict

svgSize_ = 512

edgeSize = svgSize_ // 16

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

drawInvisibleClickableSquares dimension beginPosition endPosition =
    let
        drawRect index = 
            let
                posX = Basics.remainderBy dimension.width index
                posY = index // dimension.width
            in
            Svg.rect
                ([SvgAttrs.x  <| String.fromInt <| (posX + 1) * edgeSize,
                SvgAttrs.y  <| String.fromInt <| (posY + 1) * edgeSize,
                SvgAttrs.fill "transparent",
                SvgAttrs.width <| String.fromInt edgeSize,
                SvgAttrs.height <| String.fromInt edgeSize,
                SvgEvents.onClick (SelectTile <| Position posY posX)
                ] ++ 
                if posX == beginPosition.x && posY == beginPosition.y then 
                    [blueCollorAttr, SvgAttrs.fillOpacity "0.4"]
                else if posX == endPosition.x && posY == endPosition.y then 
                    [greenCollorAttr, SvgAttrs.fillOpacity "0.4"]
                else [] )
                []
    in
    Svg.svg [
        SvgAttrs.width <| String.fromInt svgSize_,
        SvgAttrs.height <| String.fromInt svgSize_
    ]
    (List.range 0 (dimension.width * dimension.height - 1) |> List.map
        (\i ->
            drawRect i
        ) 
    )

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
                SvgAttrs.width <| String.fromInt width,
                SvgAttrs.height <| String.fromInt height,
                if not isPath 
                    then whiteColorAttr 
                    else if Maybe.withDefault 0 (Dict.get ((from.x, from.y), (to.x, to.y)) visited) == 0 then blueCollorAttr
                    else if List.member {from=from, to=to} beginEndPath then greenCollorAttr
                    else redCollorAttr
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
                            drawMazeFromListEdges model.maze [] False Dict.empty,
                            drawMazeFromListEdges model.drawedSteps model.beginEndPath True model.drawed,
                            drawInvisibleClickableSquares model.dimension model.beginPosition model.endPosition
                        ]
                    ]
                ]
            ]
        ]
