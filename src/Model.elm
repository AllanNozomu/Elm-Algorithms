module Model exposing (Model, initModel, SortType(..))

import Array exposing (Array)

type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , orderedList : List Int
    , steps : Array (List Int)
    , sortType : SortType
    , currentStep : List Int
    , leftRightSequence : Array ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Bool
    }

type SortType 
    = MergeSort
    | SelectionSort

initModel : Model
initModel =
    { seed = 0
    , listToBeSorted = []
    , steps = Array.empty
    , sortType = MergeSort
    , currentStep = []
    , orderedList = []
    , leftRightSequence = Array.empty
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    }