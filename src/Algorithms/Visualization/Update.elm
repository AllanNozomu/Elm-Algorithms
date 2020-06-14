port module Algorithms.Visualization.Update exposing (..)

import Algorithms.Visualization.Model exposing (Model, SortType(..))
import Time
import Array exposing (Array)
import Random
import Random.List
import Algorithms.Visualization.MergeSort as MergeSort
import Algorithms.Visualization.SelectionSort as SelectionSort

type Msg = 
    Roll
    | ChangeSort SortType
    | Pause
    | Continue
    | Back
    | Advance
    | Tick Time.Posix
    | NewSeed Int
    | NewSeedStart Int

port beep : (Int, Int) -> Cmd msg

shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl


getListParameters : Model -> List comparable -> (Array (Array comparable), Array (Int, Int))
getListParameters model l =
    case model.sortType of
        SelectionSort ->
            let
                ( _, selectionSortSteps ) =
                    SelectionSort.selectionSortSteps l
                
                leftRightSequence = List.map (\(_, lr) -> lr ) selectionSortSteps 
                    |> List.concat |> Array.fromList

                steps = List.map(\(st, lr) ->  List.repeat (List.length lr) st) selectionSortSteps
                    |> List.concat
                    |> List.map (\x -> Array.fromList x) |> Array.fromList
            in
                (steps, leftRightSequence)
        MergeSort ->
                let
                    ( _, steps, leftRightSequence ) =
                        MergeSort.mergeSortSteps l

                    stepsArray = List.map (\x -> Array.fromList x) steps |> Array.fromList

                    leftRightSequenceArray = Array.fromList leftRightSequence

                in
                (stepsArray, leftRightSequenceArray)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Roll ->
            let
                listLength = 
                    case model.sortType of
                        SelectionSort -> 96
                        _ -> 512
                shuffledList =
                    shuffle (List.range 0 listLength) model.seed

                (steps, leftRightSequence) = getListParameters model shuffledList
            in
            ( { model
                | listToBeSorted = shuffledList
                , orderedList = List.sort shuffledList |> Array.fromList
                , steps = steps
                , leftRightSequence = leftRightSequence
                , index = 0
              }
            , Random.generate NewSeed (Random.int 1 100000)
            )

        ChangeSort sortType ->
            update Roll {model | sortType = sortType}

        Tick _ ->
            let
                newIndex =
                    if model.index + 1 > Array.length model.steps || model.pause then
                        model.index

                    else
                        model.index + 1

                newCurr =
                    Array.get newIndex model.steps |> Maybe.withDefault model.currentStep

                ( newLeft, newRight ) =
                    Array.get newIndex model.leftRightSequence |> Maybe.withDefault ( model.currentLeft, model.currentRight )

                soundFreq = Array.get newLeft newCurr |> Maybe.withDefault 0 
            in
            ( { model
                | index = newIndex
                , currentStep = newCurr
                , currentLeft = newLeft
                , currentRight = newRight
              }
            , if model.pause || model.index + 1 > Array.length model.steps then 
                Cmd.none
              else
                beep (soundFreq * 5, 10)
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
                | index = Basics.min (Array.length model.steps) (model.index + 1)
              }
            , Cmd.none
            )

        NewSeed newFace ->
                ({ model | seed = newFace }, Cmd.none) 
        
        NewSeedStart newFace ->
                update Roll { model | seed = newFace }