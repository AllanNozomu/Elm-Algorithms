module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Model exposing (Model, initModel)
import Subscriptions exposing (subscriptions)
import Update exposing (Msg(..), update, SubPageMsg(..), changeRouteTo)
import Url
import View exposing (view)
import Route exposing (Route(..))

-- MAIN


main =
    Browser.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }

-- MODEL

init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    changeRouteTo (Route.fromUrl url) (Model.initModel url key)
