import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import emptyQuestions from '../assets/images/empty-questions.svg'
import { Button } from '../components/Button/Button'
import { RoomCode } from '../components/RoomCode/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import '../styles/room.scss'
import { Question } from '../components/Question/Question'
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const { user } = useAuth()
	const params = useParams<RoomParams>()
	const roomId = params.id
	const [newQuestion, setNewQuestion] = useState('')
	const { questions, title } = useRoom(roomId)
	const history = useHistory()

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault()

		if (newQuestion.trim() === '')
			return

		if (!user)
			throw new Error('Não há um usuário')

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar
			},
			isHighlighted: false,
			isAnswered: false
		}

		await database.ref(`rooms/${roomId}/questions`).push(question)

		setNewQuestion('')
	}

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

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder="O que você deseja perguntar?"
						onChange={event => setNewQuestion(event.target.value)}
						value={newQuestion}
					/>

					<div className="form-footer">
						{
							user ? (
								<div className="user-info">
									<img src={user.avatar} alt={user.name} />
									<span>{user.name}</span>
								</div>
							) : (
								<span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
							)
						}
						
						<Button type="submit" disabled={!user}>Enviar pergunta</Button>
					</div>
				</form>

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

				{
					questions.length === 0 ? (
						<div className="no-questions">
							<img src={emptyQuestions} alt="Não há perguntas" />
							<h2 className="title">Nenhuma pergunta por aqui...</h2>
							<p className="subtitle">Seja a primeira pessoa a fazer uma pergunta!</p>
						</div>
					) : null
				}
			</main>
		</div>
	)
}