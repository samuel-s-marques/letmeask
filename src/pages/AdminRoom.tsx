import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'
import '../styles/room.scss'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const params = useParams<RoomParams>()
	const roomId = params.id
	const { questions, title } = useRoom(roomId)
	const history = useHistory()

	async function handleDeleteQuestion(questionId: string){
		if (window.confirm('Tem certeza que deseja excluir essa pergunta?')){
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
		}
	}

	async function handleEndRoom() {
		await database.ref(`rooms/${roomId}`).update({
			endedAt: new Date()
		})

		history.push('/')
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Logo letmeask" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
					</div>
				</div>
			</header>

			<main className="content">
				<div className="room-title">
					<h1>Sala {title}</h1>
					{ questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<div className="question-list">
					{
						questions.map(question => {
							return (
								<Question
									key={question.id}
									content={question.content}
									author={question.author}
								>
									<button
										type="button"
										onClick={() => handleDeleteQuestion(question.id)}
									>
										<img src={deleteImg} alt="Remover pergunta" />
									</button>
								</Question>
							)
						})
					}
				</div>
			</main>
		</div>
	)
}