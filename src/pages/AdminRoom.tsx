import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import emptyQuestions from '../assets/images/empty-questions.svg'

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

	async function handleCheckQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true
		})
	}

	async function handleAnswerQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true
		})
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
									isAnswered={question.isAnswered}
									isHighlighted={question.isHighlighted}
								>
									{
										!question.isAnswered && (
											<>
												<button
													type="button"
													onClick={() => handleCheckQuestion(question.id)}
												>
													<img src={checkImg} alt="Marcar pergunta como respondida" />
												</button>

												<button
													type="button"
													onClick={() => handleAnswerQuestion(question.id)}
												>
													<img src={answerImg} alt="Responder pergunta" />
												</button>
											</>
										)
									}


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

				{
					questions.length === 0 ? (
						<div className="no-questions">
							<img src={emptyQuestions} alt="Não há perguntas" />
							<h2 className="title">Nenhuma pergunta por aqui...</h2>
							<p className="subtitle">Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
						</div>
					) : null
				}
			</main>
		</div>
	)
}