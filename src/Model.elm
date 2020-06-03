module Model exposing (Model, initModel, SortType(..))

type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , orderedList : List Int
    , steps : List (List Int)
    , sortType : SortType
    , currentStep : List Int
    , leftRightSequence : List ( Int, Int )
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
    , steps = []
    , sortType = MergeSort
    , currentStep = []
    , orderedList = []
    , leftRightSequence = []
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    }