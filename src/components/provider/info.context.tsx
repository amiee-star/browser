import { Dispatch, createContext, useReducer } from "react"
import React from "react"

interface StateContext {
	likeCount?: number
	viewCount?: number
}

interface StateAction {
	state: StateContext
	dispatch: Dispatch<InfoDispatch>
}

type InfoDispatchType = "set" | "clear"

interface InfoDispatch {
	type: InfoDispatchType
	payload?: StateContext
}

export const InfoContext = createContext<StateAction>({ state: {}, dispatch: () => {} })

const reducer = (preState: StateContext, params: InfoDispatch) => {
	switch (params.type) {
		case "clear":
			return {}
		case "set":
			return { ...preState, ...params.payload }
		default:
			return preState
	}
}

const InfoProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, {})
	return <InfoContext.Provider value={{ state, dispatch }}>{props.children}</InfoContext.Provider>
}

export default InfoProvider
