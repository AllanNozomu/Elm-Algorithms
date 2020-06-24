port module Pages.Sort.Update exposing (..)

import Array exposing (Array)
import Http
import Pages.Sort.Algorithms.BubbleSort as BubbleSort
import Pages.Sort.Algorithms.MergeSort as MergeSort
import Pages.Sort.Algorithms.QuickSort as QuickSort
import Pages.Sort.Algorithms.SelectionSort as SelectionSort
import Pages.Sort.Model exposing (Model, SortType(..), initModel, sortTypeToCode)
import Random
import Random.List
import Time


type Msg
    = Shuffle
    | Pause
    | Continue
    | Back
    | Advance
    | ChangeLength String
    | Tick Time.Posix
    | NewSeedStart Int


port beep : ( Int, Int ) -> Cmd msg


port highlight : () -> Cmd msg


shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    Random.initialSeed seed
        |> Random.step (Random.List.shuffle l)
        |> Tuple.first


getListParameters : Model -> List comparable -> ( Array (Array comparable), Array ( Int, Int ) )
getListParameters model l =
    let
        ( _, steps, leftRightSequence ) =
            case model.sortType of
                MergeSort ->
                    MergeSort.mergeSortSteps l

                SelectionSort ->
                    SelectionSort.selectionSortSteps l

                BubbleSort ->
                    BubbleSort.bubbleSortSteps l

                QuickSort ->
                    QuickSort.quickSortSteps l

        stepsArray =
            List.map (\x -> Array.fromList x) steps |> Array.fromList

        leftRightSequenceArray =
            Array.fromList leftRightSequence
    in
    ( stepsArray, leftRightSequenceArray )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Shuffle ->
            let
                shuffledList = shuffle model.listToBeSorted model.seed
            in
            ( { model | listToBeSorted = shuffledList }, Cmd.none)

        ChangeLength newLength ->
            let
                newListLength = String.toInt newLength |> Maybe.withDefault 0
                newListToBeSorted = shuffle (List.range 0 (newListLength - 1)) model.seed
            in
            ({ model | listLength = newListLength, listToBeSorted = newListToBeSorted, index = 0, steps = Array.empty, pause=True }, Cmd.none)

        Tick _ ->
            let
                newModel =
                    updateIndex model (model.index + 1)
            in
            ( newModel, beep ( getSoundFreq newModel, 10 ) )

        Pause ->
            ( { model | pause = True }, Cmd.none )

        Continue ->
            let
                newModel =
                    updateIndex model model.index
            in
                ( { newModel | pause = False }, Cmd.none )

        Back ->
            let
                newModel =
                    updateIndex model (model.index - 1)
            in
            ( newModel, beep ( getSoundFreq newModel, 10 ) )

        Advance ->
            let
                newModel =
                    updateIndex model (model.index + 1)
            in
            ( newModel, beep ( getSoundFreq newModel, 10 ) )

        NewSeedStart newSeed ->
            let
                (newModel, cmd) = update Shuffle { model | seed = newSeed }
            in

            (newModel, Cmd.batch [highlight(), cmd])


getSoundFreq : Model -> Int
getSoundFreq model =
    Array.get model.currentLeft model.currentStep
        |> Maybe.withDefault 0
        |> (*) 5


updateIndex : Model -> Int -> Model
updateIndex model index =
    let
        ( steps, leftRightSequence ) =
            if Array.isEmpty model.steps then
                getListParameters model model.listToBeSorted

            else
                ( model.steps, model.leftRightSequence )

        newIndex =
            if index > model.index then
                Basics.min (Array.length model.steps) index

            else
                Basics.max 0 index

        newCurr =
            Array.get newIndex steps |> Maybe.withDefault model.currentStep

        ( newLeft, newRight ) =
            Array.get newIndex leftRightSequence |> Maybe.withDefault ( model.currentLeft, model.currentRight )

        newPause =
            model.pause || newIndex == Array.length model.steps
    in
    { model
        | currentLeft = newLeft
        , currentRight = newRight
        , currentStep = newCurr
        , index = newIndex
        , pause = newPause
        , steps = steps
        , leftRightSequence = leftRightSequence
    }
