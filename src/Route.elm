module Route exposing (Route(..), fromUrl, href)

import Html.Styled exposing (Attribute)
import Html.Styled.Attributes as Attr
import List
import Model exposing (CurrentModel(..))
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, fragment, oneOf, s, string)


type Route
    = Home
    | SortAlgorithmsPage String
    | GraphAlgorithmsPage String
    | MazeAlgorithmsPage String


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map SortAlgorithmsPage (s "sortAlgorithms" </> string)
        , Parser.map GraphAlgorithmsPage (s "graphAlgorithms" </> string)
        , Parser.map MazeAlgorithmsPage (s "mazeAlgorithms" </> string)
        ]


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.parse parser { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }


href : Route -> Attribute msg
href route =
    Attr.href (routeToString route)


routeToString : Route -> String
routeToString page =
    "#/" ++ String.join "/" (routeToPieces page |> List.filter (\s -> not <| String.isEmpty s))


routeToPieces : Route -> List String
routeToPieces page =
    case page of
        Home ->
            []

        SortAlgorithmsPage algorithm ->
            [ "sortAlgorithms", algorithm ]

        GraphAlgorithmsPage algorithm ->
            [ "graphAlgorithms", algorithm ]

        MazeAlgorithmsPage algorithm ->
            [ "mazeAlgorithms", algorithm ]
