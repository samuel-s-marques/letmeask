import { Link } from 'react-router-dom'

import '../../styles/notfound.scss'

export function NotFound() {
	return (
		<div id="main">
			<h1>404</h1>
			<div id="middle">
				<h2>Esta página não foi encontrada. <Link to="/">Retornar à homepage.</Link></h2>
			</div>
		</div>
	)
} 