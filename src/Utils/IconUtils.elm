module Utils.IconUtils exposing (toStyledHtml)

import FeatherIcons exposing(Icon)
import Html.Styled as Html exposing (Html)

toStyledHtml : Icon -> Html msg
toStyledHtml icon = 
    icon |>
    FeatherIcons.toHtml []
    |> Html.fromUnstyled