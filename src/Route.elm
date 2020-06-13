module Route exposing (Route(..), fromUrl, href)

import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string, fragment)
import Model exposing (CurrentModel(..))
import Html.Styled exposing (Attribute)
import Html.Styled.Attributes as Attr
import List

type Route 
    = Home
    | SortAlgorithmsPage String

parser : Parser (Route -> a) a
parser =
    oneOf [
        Parser.map Home Parser.top,
        Parser.map SortAlgorithmsPage (s "sortAlgorithms" </> string)
    ]

fromUrl : Url -> Maybe Route
fromUrl url = 
    Parser.parse parser {url | path = Maybe.withDefault "" url.fragment, fragment = Nothing}

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

        SortAlgorithmsPage algorithm->
            ["sortAlgorithms", algorithm]