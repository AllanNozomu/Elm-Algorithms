module View exposing (view)

import Browser
import Dict
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes as HtmlAttributes exposing (class, css, disabled, id)
import Html.Styled.Events exposing (onClick)
import Model exposing (CurrentModel(..), Model)
import Pages.Home as Home
import Pages.Sort.Model as SortModel
import Pages.Sort.View as SortView
import Pages.Graph.Model as GraphView
import Pages.Graph.View as GraphView
import Route exposing (Route(..), href)
import Update exposing (Msg(..), SubPageMsg(..))
import Url
import VirtualDom.Styled exposing (attribute)


view : Model -> Browser.Document Msg
view model =
    let
        currentPage =
            case model.currentModel of
                SortAlgorithmsModel sortmodel ->
                    SortView.view sortmodel
                        |> Html.map SortMsg
                        |> Html.map SubPageMsg

                GraphAlgorithmModel graphModel ->
                    GraphView.view graphModel
                        |> Html.map GraphMsg
                        |> Html.map SubPageMsg

                HomeModel ->
                    Home.view
    in
    { title = "Elm algorithms"
    , body =
        [ div [ css [ marginBottom (px 25) ] ]
            [ navbar model.url
            , div [ class "container" ]
                [ currentPage ]
            , footerBar
            ]
        ]
            |> List.map Html.toUnstyled
    }


navbar : Url.Url -> Html Msg
navbar url =
    let
        sortMethods =
            Dict.toList SortModel.sortInfos
            |> List.map (\(_, {sortName}) -> sortName) 
    in
    nav [ class "navbar navbar-expand-lg navbar-dark bg-dark" ]
        [ a [ class "navbar-brand" ] [ text "Algorithms in Elm" ]
        , div [ class "collapse navbar-collapse" ]
            [ ul [ class "navbar-nav" ]
                [ li [ class "nav-item dropdown" ]
                    [ a
                        [ class "nav-link dropdown-toggle"
                        , HtmlAttributes.href <| "#" ++ Maybe.withDefault "" url.fragment
                        , attribute "data-toggle" "dropdown"
                        , attribute "aria-haspopup" "true"
                        , attribute "aria-expanded" "false"
                        ]
                        [ text "Sort Algorithms" ]
                    , div [ class "dropdown-menu" ]
                        (List.map
                            (\sm -> a [ class "dropdown-item", href (Route.SortAlgorithmsPage sm) ] [ text sm ])
                            sortMethods
                        )
                    ]
                , li [ class "nav-item" ]
                    [ a [ class "nav-link disabled" ]
                        [ text "Under construction" ]
                    ]
                ]
            ]
        ]


footerBar : Html Msg
footerBar =
    footer
        [ class "footer bg-light fixed-bottom"
        , css
            [ position fixed
            , bottom (px 0)
            , width (pct 100)
            , height (px 25)
            ]
        ]
        [ div
            [ class "container"
            , css
                [ displayFlex
                , alignItems center
                , justifyContent center
                ]
            ]
            [ span []
                [ text "Made with "
                , i [ class "devicon-elm-plain" ] []
                , text " by "
                , a [ HtmlAttributes.href "https://github.com/allannozomu/Elm-algorithms" ] [ text "allannozomu" ]
                ]
            ]
        ]
