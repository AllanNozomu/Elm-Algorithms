module View exposing (view)

import Pages.Sort.View as SortView
import Browser
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (class, id, disabled)
import Model exposing (CurrentModel(..), Model)
import Pages.Home as Home
import Route exposing (Route(..), href)
import Update exposing (Msg(..), SubPageMsg(..))
import VirtualDom.Styled exposing (attribute)
import Html.Styled.Events exposing (onClick)
import Url


view : Model -> Browser.Document Msg
view model =
    let
        currentPage =
            case model.currentModel of
                SortAlgorithmsModel sortmodel ->
                    SortView.view sortmodel
                        |> Html.map AlgorithmsMsg
                        |> Html.map SubPageMsg

                HomeModel ->
                    Home.view
    in
    { title = "Elm algorithms"
    , body =
        [ navbar model.url
        , div [ class "container" ]
            [ currentPage ]
        ]
            |> List.map Html.toUnstyled
    }


navbar : Url.Url -> Html Msg
navbar url =
    nav [ class "navbar navbar-expand-lg navbar-light bg-light" ]
        [ a [ class "navbar-brand" ] [ text "Algorithms in Elm" ]
        , div [ class "collapse navbar-collapse" ]
            [ ul [ class "navbar-nav" ]
                [ li [ class "nav-item dropdown" ]
                    [ a
                        [ class "nav-link dropdown-toggle"
                        , HtmlAttributes.href <| "#" ++ Maybe.withDefault "" url.fragment
                        , attribute "data-toggle" "dropdown"
                        , attribute "aria-haspopup" "true"
                        ,attribute "aria-expanded" "false"

                        ]
                        [ text "Sort Algorithms" ]
                    , div [ class "dropdown-menu" ]
                        [ a [ class "dropdown-item", href (Route.SortAlgorithmsPage "mergeSort") ] [ text "Merge Sort" ]
                        -- , a [ class "dropdown-item", href (Route.SortAlgorithmsPage "selectionSort") ] [ text "Merge Sort" ]
                        ]
                    ]
                , li [ class "nav-item"]
                    [ a [ class "nav-link disabled"]
                        [ text "Under construction" ]
                    ]
                ]
            ]
        ]
