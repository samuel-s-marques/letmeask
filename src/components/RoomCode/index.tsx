import copyImg from '../../assets/images/copy.svg'
import './styles.scss'
import toast, { Toaster } from 'react-hot-toast'

type RoomCodeProps = {
	code: string;
}

export function RoomCode(props: RoomCodeProps) {
	function copyRoomCodeToClipboard() {
		navigator.clipboard.writeText(props.code)
		.then(() => {
			toast.success('Código copiado!')
		})
		.catch(() => {
			toast.error('Não foi possível copiar o código!')
		})
	}

	return (
		<>
			<Toaster 
				position="top-right"
				reverseOrder={false}
			/>

			<button className="room-code" onClick={copyRoomCodeToClipboard}>
				<div>
					<img src={copyImg} alt="Copy room code" />
				</div>
				<span>Sala #{props.code}</span>
			</button>
		</>
	)
}