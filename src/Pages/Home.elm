module Pages.Home exposing (view)

import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class)
import Route exposing (Route(..), href)
import Update exposing (Msg(..))
import Pages.Sort.Model as SortModel
import Dict


view : Html Msg
view =
    let
        sortMethods =
            Dict.toList SortModel.sortInfos
            |> List.map (\(_, {sortName}) -> sortName) 
    in
    div [ class "row" ]
        [ div [class "col"]
            [ h1 []
                [ text "Algorithms in elm" ]
            , h3 [][text "Sort Algorithms"]
            , ul [] (List.map (\sm ->
                li [][ a [ href (Route.SortAlgorithmsPage sm) ] [ text sm ] ])
                sortMethods
                )
            ]
        ]
