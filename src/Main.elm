module Main exposing (..)

import Array
import Browser
import Html exposing (..)
import Html.Attributes exposing (src)
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


shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl



-- MODEL


type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , steps : List (List Int)
    , currentStep : List Int
    , leftRightSequence : List ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Bool
    }


initModel : Model
initModel =
    let
        shuffledList =
            shuffle (List.range 0 512) 1

        ( orderedList, steps, leftRightSequence ) =
            MergeSort.mergeSortSteps 0 shuffledList
    in
    { seed = 0
    , listToBeSorted = shuffledList
    , steps = steps
    , currentStep = orderedList
    , leftRightSequence = leftRightSequence
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initModel
    , Random.generate NewSeed (Random.int 1 100000)
    )



-- UPDATE


type Msg
    = Roll
    | NewSeed Int
    | Tick Time.Posix
    | Pause
    | Continue
    | Back
    | Advance


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Roll ->
            let
                shuffledList =
                    shuffle (List.range 0 512) model.seed

                ( orderedList, steps, leftRightSequence ) =
                    MergeSort.mergeSortSteps 0 shuffledList
            in
            ( { model
                | listToBeSorted = shuffledList
                , currentStep = orderedList
                , steps = steps
                , leftRightSequence = leftRightSequence
                , index = 0
              }
            , Random.generate NewSeed (Random.int 1 100000)
            )

        NewSeed newFace ->
            ( { model
                | seed = newFace
              }
            , Cmd.none
            )

        Tick _ ->
            let
                newIndex =
                    if model.index + 1 > List.length model.steps || model.pause then
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

        Pause ->
            ( { model
                | pause = True
              }
            , Cmd.none
            )

        Continue ->
            ( { model
                | pause = False
              }
            , Cmd.none
            )

        Back ->
            ( { model
                | index = Basics.max 0 (model.index - 1)
              }
            , Cmd.none
            )

        Advance ->
            ( { model
                | index = Basics.min (List.length model.listToBeSorted) (model.index + 1)
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
        [ h1 [] [ text "Merge sort" ]
        , h1 [] [ text <| String.fromInt model.index ++ " Steps" ]
        , Svg.svg
            [ width "1024"
            , height "512"
            , viewBox "0 0 1024 512"
            ]
            (List.indexedMap
                (\index barHeight ->
                    Svg.rect
                        [ x <| String.fromInt <| index * 2
                        , y <| String.fromInt (512 - barHeight * 1)
                        , width "2"
                        , getColor index
                        , height <| String.fromInt <| barHeight * 1
                        ]
                        []
                )
                model.currentStep
            )
        , button [ onClick Roll ] [ text "Shuffle" ]
        , button [ onClick Back, Html.Attributes.disabled (model.index <= 0) ] [ text "<" ]
        , button [ onClick Pause, Html.Attributes.disabled model.pause ] [ text "Pause" ]
        , button [ onClick Continue, Html.Attributes.disabled <| not model.pause ] [ text "Continue" ]
        , button [ onClick Advance, Html.Attributes.disabled (model.index >= List.length model.steps) ] [ text ">" ]
        ]
