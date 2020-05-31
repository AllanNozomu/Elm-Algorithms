module Main exposing (..)

import Array
import Browser
import Html exposing (..)
import Html.Events exposing (..)
import MergeSort
import Random
import Random.List
import Svg
import Svg.Attributes exposing (..)
import Time



-- MAIN


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }


shuffle : List comparable -> List comparable
shuffle l =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed 1)
    in
    newl



-- MODEL


type alias Model =
    { dieFace : Int
    , listToBeSorted : List Int
    , steps : List (List Int)
    , currentStep : List Int
    , leftRightSequence : List ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    }


initModel : Model
initModel =
    let
        shuffledList =
            shuffle (List.range 0 512)

        ( orderedList, steps, leftRightSequence ) =
            MergeSort.mergeSortSteps 0 shuffledList
    in
    { dieFace = 0
    , listToBeSorted = shuffledList
    , steps = steps
    , currentStep = orderedList
    , leftRightSequence = leftRightSequence
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initModel
    , Cmd.none
    )



-- UPDATE


type Msg
    = Roll
    | NewFace Int
    | Tick Time.Posix


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Roll ->
            ( model
            , Random.generate NewFace (Random.int 1 6)
            )

        NewFace newFace ->
            ( { model
                | dieFace = newFace
              }
            , Cmd.none
            )

        Tick _ ->
            let
                newIndex =
                    if model.index + 1 > List.length model.steps then
                        model.index

                    else
                        model.index + 1

                newCurr =
                    Array.fromList model.steps |> Array.get newIndex |> Maybe.withDefault model.currentStep

                ( newLeft, newRight ) =
                    Array.fromList model.leftRightSequence |> Array.get newIndex |> Maybe.withDefault ( model.currentLeft, model.currentRight )
            in
            ( { model
                | index = newIndex
                , currentStep = newCurr
                , currentLeft = newLeft
                , currentRight = newRight
              }
            , Cmd.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1 Tick



-- VIEW


view : Model -> Html Msg
view model =
    let

        getColor index =
            if index == model.currentLeft then
                fill "red"

            else if index == model.currentRight then
                fill "yellow"

            else
                fill "black"
    in
    div []
        [ h1 [] [ text <| String.fromInt model.index ]
        , button [ onClick Roll ] [ text "Roll" ]
        , Svg.svg
            [ width "1024"
            , height "640"
            , viewBox "0 0 1024 640"
            ]
            (List.indexedMap
                (\index barHeight ->
                    Svg.rect
                        [ x <| String.fromInt <| index * 2
                        , y <| String.fromInt (640 - barHeight * 1)
                        , width "2"
                        , getColor index
                        , height <| String.fromInt <| barHeight * 1
                        ]
                        []
                )
                model.currentStep
            )
        ]
