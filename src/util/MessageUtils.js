import Swal from "sweetalert2";

const theme = {
  primary: "#1976D2", // Azul
  error: "#E53935",   // Vermelho
} 

export function exibirMensagem(titulo, mensagem, tipo = "error"){
	return Swal.fire({
		title: titulo,
		html: mensagem,
		icon: tipo,
		showCancelButton: false,
		showConfirmButton: true,
		confirmButtonColor: theme?.primary,
		confirmButtonText: "OK",
	});
}

export function exibirMensagemAtencao(mensagem, tipo = "info"){
	return Swal.fire({
		title: "Atenção",
		html: mensagem,
		icon: tipo,
		showCancelButton: false,
		showConfirmButton: true,
		confirmButtonColor: theme?.primary,
		confirmButtonText: "OK",
	});
}

export function exibirMensagemErro(mensagem){
	exibirMensagem("Erro", mensagem);
}

export function exibirMensagemSucesso(mensagem){
	exibirMensagem("Sucesso", mensagem, "success");
}

export function exibirMensagemInfo(mensagem){
	exibirMensagem("Atenção", mensagem, "info");
}

export function exibirModalConfirmacao(titulo, mensagem = null, showCancelButton = true, confirmButtonText = "SIM"){
	return Swal.fire({

		title: titulo,

		text: mensagem,

		showCancelButton,

		showConfirmButton: true,

		confirmButtonColor: theme?.primary,

		cancelButtonColor: theme?.error,

		confirmButtonText,

		cancelButtonText: "NÃO",

	});
}

export function exibirModalConfirmacaoExclusao(titulo, mensagem = null, showCancelButton = true, confirmButtonText = "EXCLUIR"){
	const inputOptions = {
		input: "text",
		inputPlaceholder: "Digite o motivo da exclusão",
		showCancelButton: true,
		inputValidator: (value) => {
			if(!value.trim()){
				return "Você precisa digitar o motivo da exclusão!";
			}
			return ""; // Return empty string to indicate no error
		},
	};

	return Swal.fire({
		title: titulo,
		text: mensagem,
		input: "text",
		inputOptions,
		showCancelButton,
		showConfirmButton: true,
		confirmButtonColor: theme?.error,
		cancelButtonColor: theme?.primary,
		confirmButtonText,
		cancelButtonText: "CANCELAR",
	});


}

function trataListaMensagem(listaErro){
	let msgFormatada = "";
	const possuiMaisDeUmaMensagem = listaErro.length > 1;
	listaErro.forEach((erro) => {
		if(possuiMaisDeUmaMensagem){
			msgFormatada += "- ";
		}
		if(erro.mensagem != undefined){
			msgFormatada += `${erro.mensagem}`;
			msgFormatada += " <br> ";
		}
		else if(erro?.errors?.length > 0){
			msgFormatada += `${erro.errors}`;
			msgFormatada += " <br> ";
		}
		else{
			msgFormatada += `${erro}`;
			msgFormatada += " <br> ";
		}
	});
	return msgFormatada;
}

export function exibirMensagemErroApi(response, msgDefault){
	if(response != null && response instanceof Array && response?.length > 0){
		const msg = trataListaMensagem(response);
		exibirMensagemErro(msg);
		return;
	}

	if(response?.errors != null && response?.errors instanceof Array && response?.errors.length > 0){
		const msg = trataListaMensagem(response.errors);
		console.log(msg);
		exibirMensagemErro(msg);
		return;
	}

	if(response?.mensagem != undefined){
		exibirMensagemErro(response.mensagem);
		return;
	}

	exibirMensagemErro(msgDefault);
}
