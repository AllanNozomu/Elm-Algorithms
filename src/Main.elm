module Main exposing (..)

import Browser
import Subscriptions exposing (subscriptions)
import Update exposing (update, init, Msg(..))
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