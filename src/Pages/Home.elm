module Pages.Home exposing (view)

import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class)
import Route exposing (Route(..), href)
import Update exposing (Msg(..))


view : Html Msg
view =
    div [ class "row" ]
        [ div [class "col"]
            [ h1 []
                [ text "Algorithms in elm" ]
            , a [ href (Route.SortAlgorithmsPage "mergeSort") ] [ text "Sort algorithms" ]
            ]
        ]
