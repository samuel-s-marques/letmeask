import { useHistory, useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { useState } from 'react'

import logoImg from '../assets/images/logo.svg'
import emptyQuestions from '../assets/images/empty-questions.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'
import '../styles/room.scss'
import '../styles/modal.scss'
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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteQuestionModalOpen, setIsDeleteQuestionModalOpen] = useState(false)
	const [questionId, setQuestionId ] = useState('')

	async function handleDeleteQuestion(questionId: string){
		await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
		setIsDeleteQuestionModalOpen(false)
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
						<Button isOutlined onClick={() => setIsModalOpen(true)}>Encerrar sala</Button>
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
													className="check-button"
												>
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
														<path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
													</svg>
												</button>

												<button
													type="button"
													onClick={() => handleAnswerQuestion(question.id)}
													className="answer-button"
												>
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
													</svg>
												</button>
											</>
										)
									}


									<button
										type="button"
										onClick={() => { setIsDeleteQuestionModalOpen(true); setQuestionId(question.id) }}
										className="delete-button"
									>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
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

			<Modal
				isOpen={isModalOpen}
				ariaHideApp={false}
				onRequestClose={() => setIsModalOpen(false)}
				contentLabel="Deseja mesmo encerrar a sala?"
				style={{
					overlay: {
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(5, 2, 6, 0.8)',
					}
				}}
				className="Modal"
			>
				<div className="excludeModal">
					<svg
						width="48"
						height="48"
						viewBox="0 0 48 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M29.66 18.3398L18.34 29.6598"
							stroke="#E73F5D"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M29.66 29.6598L18.34 18.3398"
							stroke="#E73F5D"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z"
							stroke="#E73F5D"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					<h2>Encerrar sala</h2>
					<p>Tem certeza que você deseja encerrar esta sala?</p>

					<div>
						<button type="button" id="cancelar" onClick={() => setIsModalOpen(false)}>
							Cancelar
						</button>

						<button type="button" id="encerrar" onClick={handleEndRoom}>
							Sim, encerrar
						</button>
					</div>
				</div>
			</Modal>

			<Modal
				isOpen={isDeleteQuestionModalOpen}
				ariaHideApp={false}
				onRequestClose={() => setIsDeleteQuestionModalOpen(false)}
				contentLabel="Deseja mesmo excluir a pergunta?"
				style={{
					overlay: {
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(5, 2, 6, 0.8)',
					}
				}}
				className="Modal"
			>
				<div className="excludeModal">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3 5.99988H5H21"
							stroke="#E73F5D"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
							stroke="#E73F5D"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					<h2>Excluir pergunta</h2>
					<p>Tem certeza que você deseja excluir esta pergunta?</p>

					<div>
						<button type="button" id="cancelar" onClick={() => setIsDeleteQuestionModalOpen(false)}>
							Cancelar
						</button>

						<button type="button" id="encerrar" onClick={() => handleDeleteQuestion(questionId)}>
							Sim, excluir
						</button>
					</div>
				</div>
			</Modal>
		</div>
	)
}