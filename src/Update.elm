module Update exposing (update, Msg(..))

import Array
import Random
import Random.List
import Browser
import Browser.Navigation as Nav
import Url
import Time
import Model exposing (Model, SortType(..))
import MergeSort
import SelectionSort

shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl

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
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url

getListParameters model l =
    case model.sortType of
        SelectionSort ->
            let
                ( _, selectionSortSteps ) =
                    SelectionSort.selectionSortSteps l
                
                leftRightSequence = List.map (\(_, lr) -> lr ) selectionSortSteps 
                    |> List.concat

                steps = List.map(\(st, lr) ->  List.repeat (List.length lr) st) selectionSortSteps
                    |> List.concat
            in
                (steps, leftRightSequence)
        MergeSort ->
                let
                    ( _, steps, leftRightSequence ) =
                        MergeSort.mergeSortSteps l

                in
                (steps, leftRightSequence)

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
                , orderedList = List.sort shuffledList
                , steps = Array.fromList steps
                , leftRightSequence = Array.fromList leftRightSequence
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
                | index = Basics.min (Array.length model.steps) (model.index + 1)
              }
            , Cmd.none
            )

        NewSeed newFace ->
                ({ model | seed = newFace }, Cmd.none) 
        
        NewSeedStart newFace ->
                update Roll { model | seed = newFace }

        UrlChanged url -> 
            ({model | url = url}, Cmd.none)

        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url -> 
                    ( model, Nav.pushUrl model.key (Url.toString url))
                Browser.External href ->
                    (model, Nav.load href)