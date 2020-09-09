import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Comment, getComments, Issue} from '../../api/githubAPI'
import {AppThunk} from '../../app/store'

interface CommentState {
    commentsByIssue: Record<number, Comment[] | undefined>
    loading: boolean
    error: string | null
}

interface CommentLoader {
    issueId: number
    comments: Comment[]
}

const initialState: CommentState = {
    commentsByIssue: {},
    loading: false,
    error: null
}

const comments = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        getCommentsStart(state) {
            state.loading = true
            state.error = null
        },
        getCommentsSuccess(state, action: PayloadAction<CommentLoader>) {
            const {comments, issueId} = action.payload
            state.commentsByIssue[issueId] = comments
            state.loading = false
            state.error = null
        },
        getCommentsFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {getCommentsFailure, getCommentsStart, getCommentsSuccess} = comments.actions
export default comments.reducer

export const fetchComments = (issue: Issue): AppThunk => async dispatch => {
    try {
        dispatch(getCommentsStart())
        const comments = await getComments(issue.comments_url)
        dispatch(getCommentsSuccess({issueId: issue.number, comments}))
    } catch (e) {
        dispatch(getCommentsFailure(e))
    }
}