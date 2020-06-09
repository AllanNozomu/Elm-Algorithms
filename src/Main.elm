module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Model exposing (Model, initModel)
import Random
import Subscriptions exposing (subscriptions)
import Update exposing (Msg(..), update, SubPageMsg(..))
import Url
import View exposing (view)
import Algorithms.Visualization.Update as Algorithms


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
    , List.map (\s -> Cmd.map AlgorithmsMsg s |> Cmd.map SubPageMsg) [Random.generate Algorithms.NewSeedStart (Random.int 1 1000000)] 
            |> Cmd.batch
    )
