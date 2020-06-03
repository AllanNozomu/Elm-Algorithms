module Main exposing (..)

import Random
import Browser
import Update exposing (update, Msg(..))
import Model exposing (Model, initModel)
import Subscriptions exposing (subscriptions)
import View exposing (view)


-- MAIN

main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }

-- MODEL

init : () -> ( Model, Cmd Msg )
init _ =
    ( initModel
    , Random.generate NewSeedStart (Random.int 1 100000)
    )