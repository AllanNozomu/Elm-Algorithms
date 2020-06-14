port module Pages.Sort.Update exposing (..)

import Array exposing (Array)
import Pages.Sort.Algorithms.MergeSort as MergeSort
import Pages.Sort.Algorithms.SelectionSort as SelectionSort
import Pages.Sort.Model exposing (Model, SortType(..))
import Random
import Random.List
import Time


type Msg
    = Roll
    | ChangeSort SortType
    | Pause
    | Continue
    | Back
    | Advance
    | Tick Time.Posix
    | NewSeed Int
    | NewSeedStart Int


port beep : ( Int, Int ) -> Cmd msg


shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl


getListParameters : Model -> List comparable -> ( Array (Array comparable), Array ( Int, Int ) )
getListParameters model l =
    case model.sortType of
        SelectionSort ->
            let
                ( _, selectionSortSteps ) =
                    SelectionSort.selectionSortSteps l

                leftRightSequence =
                    List.map (\( _, lr ) -> lr) selectionSortSteps
                        |> List.concat
                        |> Array.fromList

                steps =
                    List.map (\( st, lr ) -> List.repeat (List.length lr) st) selectionSortSteps
                        |> List.concat
                        |> List.map (\x -> Array.fromList x)
                        |> Array.fromList
            in
            ( steps, leftRightSequence )

        MergeSort ->
            let
                ( _, steps, leftRightSequence ) =
                    MergeSort.mergeSortSteps l

                stepsArray =
                    List.map (\x -> Array.fromList x) steps |> Array.fromList

                leftRightSequenceArray =
                    Array.fromList leftRightSequence
            in
            ( stepsArray, leftRightSequenceArray )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Roll ->
            let
                listLength =
                    case model.sortType of
                        SelectionSort ->
                            64

                        _ ->
                            512

                shuffledList =
                    shuffle (List.range 0 listLength) model.seed

                ( steps, leftRightSequence ) =
                    getListParameters model shuffledList
                (newModel, _) = update Back { model
                    | listToBeSorted = shuffledList
                    , orderedList = List.sort shuffledList |> Array.fromList
                    , steps = steps
                    , leftRightSequence = leftRightSequence
                    , index = 0
                    }
            in
            ( newModel, Random.generate NewSeed (Random.int 1 100000))

        ChangeSort sortType ->
            update Roll { model | sortType = sortType }

        Tick _ ->
            let
                newModel =
                    updateIndex model (model.index + 1)
            in
                ( newModel, beep ( getSoundFreq newModel, 10 ))

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
            let
                newModel =
                    updateIndex model (model.index - 1)
            in
                ( newModel, beep ( getSoundFreq newModel, 10 ))

        Advance ->
            let
                newModel =
                    updateIndex model (model.index + 1)
            in
                ( newModel, beep ( getSoundFreq newModel, 10 ))

        NewSeed newFace ->
            ( { model | seed = newFace }, Cmd.none )

        NewSeedStart newFace ->
            update Roll { model | seed = newFace }

getSoundFreq : Model -> Int
getSoundFreq model =
    Array.get model.currentLeft model.currentStep 
    |> Maybe.withDefault 0
    |> (*) 5 

updateIndex : Model -> Int -> Model
updateIndex model index =
    let
        newIndex =
            if index > model.index then
                Basics.min (Array.length model.steps) index

            else
                Basics.max 0 index

        newCurr =
            Array.get newIndex model.steps |> Maybe.withDefault model.currentStep

        ( newLeft, newRight ) =
            Array.get newIndex model.leftRightSequence |> Maybe.withDefault ( model.currentLeft, model.currentRight )

        newPause = model.pause || newIndex == Array.length model.steps
    in
    { model
        | currentLeft = newLeft
        , currentRight = newRight
        , currentStep = newCurr
        , index = newIndex
        , pause = newPause
    }
