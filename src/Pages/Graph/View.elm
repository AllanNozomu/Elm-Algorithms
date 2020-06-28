module Pages.Graph.View exposing (view)

import Array
import Css exposing (..)
import FeatherIcons
import Html.Styled exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (attribute, class, css, max, min, step, type_, value)
import Html.Styled.Events exposing (onClick, onInput)
import Html.Styled.Keyed as HtmlKeyed
import Html.Styled.Lazy as HtmlLazy
import Algorithms.Graphs.MazeGenerator exposing (mazeToString, Tile(..))
import Pages.Graph.Model exposing (Model)
import Pages.Graph.Update exposing (Msg(..))
import Svg.Styled as Svg
import Svg.Styled.Attributes as SvgAttrs
import Svg.Styled.Keyed as SvgKeyed
import Svg.Styled.Lazy as SvgLazy
import Utils.IconUtils exposing (toStyledHtml)

drawLine lineIndex line = 
    Array.indexedMap (\index x ->
        case x of
            Free -> Svg.rect [][] 
            Occupied -> 
                Svg.rect
                    [ SvgAttrs.x <| String.fromInt <| (index * 16)
                    , SvgAttrs.y <| String.fromInt (1024 - ((lineIndex + 1) * 16))
                    , SvgAttrs.width "16"
                    , SvgAttrs.height "16"
                    , SvgAttrs.fill "black"
                    ]
                    []) line
                    |> Array.toList

view : Model -> Html Msg
view model =
    div []
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ h1 []
                    [ text <| "Maze" ]
    
                , div
                    [ css
                        [ displayFlex
                        , alignItems center
                        , justifyContent center
                        , margin (px 5)
                        , width (pct 100)
                        ]
                    ]
                    [
                        Svg.svg
                        [ SvgAttrs.width "100%"
                        , SvgAttrs.height "100%"
                        , SvgAttrs.viewBox "0 0 1024 1024"
                        ]
                        (Array.indexedMap drawLine model.maze |> Array.toList |> List.concat)
                    ]
                ]
            ]
        ]
