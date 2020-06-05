module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Model exposing (Model, initModel)
import Random
import Subscriptions exposing (subscriptions)
import Update exposing (Msg(..), update)
import Url
import View exposing (view)



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
    ( Model.initModel url key
    , Random.generate NewSeedStart (Random.int 1 100000)
    )
