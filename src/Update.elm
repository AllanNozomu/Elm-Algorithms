module Update exposing (update, Msg(..))

import Array
import Random
import Random.List
import Time
import Model exposing (Model)
import MergeSort

shuffle : List comparable -> Int -> List comparable
shuffle l seed =
    let
        ( newl, _ ) =
            Random.step (Random.List.shuffle l) (Random.initialSeed seed)
    in
    newl
type Msg
    = Roll
    | NewSeed Int
    | NewSeedStart Int
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
                , orderedList = orderedList
                , steps = steps
                , leftRightSequence = leftRightSequence
                , index = 0
              }
            , Random.generate NewSeed (Random.int 1 100000)
            )

        NewSeed newFace ->
                ({ model | seed = newFace }, Cmd.none) 
        
        NewSeedStart newFace ->
                update Roll { model | seed = newFace }

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
                | index = Basics.min (List.length model.steps) (model.index + 1)
              }
            , Cmd.none
            )
