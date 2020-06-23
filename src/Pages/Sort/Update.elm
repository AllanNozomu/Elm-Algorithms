port module Pages.Sort.Update exposing (..)

import Array exposing (Array)
import Http
import Pages.Sort.Algorithms.BubbleSort as BubbleSort
import Pages.Sort.Algorithms.MergeSort as MergeSort
import Pages.Sort.Algorithms.QuickSort as QuickSort
import Pages.Sort.Algorithms.SelectionSort as SelectionSort
import Pages.Sort.Model exposing (Model, SortType(..), sortTypeToCode)
import Random
import Random.List
import Time


type Msg
    = Roll
    | Pause
    | Continue
    | Back
    | Advance
    | ChangeLength String
    | Tick Time.Posix
    | NewSeed Int
    | NewSeedStart Int


port beep : ( Int, Int ) -> Cmd msg

port highlight : () -> Cmd msg

shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl


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
        Roll ->
            let
                listLength =
                    case model.sortType of
                        SelectionSort ->
                            model.listLength

                        _ ->
                            model.listLength

                shuffledList =
                    shuffle (List.range 0 (listLength - 1)) model.seed

                ( newModel, _ ) =
                    update Back
                        { model
                            | listToBeSorted = shuffledList
                            , orderedList = List.sort shuffledList |> Array.fromList
                            , index = 0
                            , currentLeft = 0
                            , currentRight = 0
                            , currentStep = Array.empty
                            , steps = Array.empty
                            , leftRightSequence = Array.empty
                            , code = sortTypeToCode model.sortType
                        }
            in
            ( newModel, Cmd.batch [Random.generate NewSeed (Random.int 1 100000), highlight ()] )

        ChangeLength newLength ->
            let
                newListLength =
                    String.toInt newLength
                        |> Maybe.withDefault 0
            in
            update Roll { model | listLength = newListLength }

        Tick _ ->
            let
                newModel =
                    updateIndex model (model.index + 1)
            in
            ( newModel, beep ( getSoundFreq newModel, 10 ) )

        Pause ->
            ( { model | pause = True }, Cmd.none )

        Continue ->
            if Array.isEmpty model.steps then
                let
                    ( steps, leftRightSequence ) =
                        getListParameters model model.listToBeSorted
                in
                ( { model
                    | pause = False
                    , steps = steps
                    , leftRightSequence = leftRightSequence
                  }
                , Cmd.none
                )

            else
                ( { model | pause = False }, Cmd.none )

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
