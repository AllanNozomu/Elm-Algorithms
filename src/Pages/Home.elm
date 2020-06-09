module Pages.Home exposing (view)

import Algorithms.Visualization.Model exposing (SortType(..))
import Bootstrap.Grid as Grid
import Html exposing (..)
import Update exposing (Msg(..))
import Route exposing (href, Route(..))


view : Html Msg
view =
    div []
        [ Grid.row []
            [ Grid.col []
                [ h1 []
                    [ text "Algorithms in elm" ],
                    a  [ href (Route.SortAlgorithmsPage "mergeSort")] [ text "Sort algorithms" ]
                ]
            ]
        ]