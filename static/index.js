var date = new Date()
var new_date = date.toLocaleDateString('pt-BR')
let display_date= "Data: " + new_date

//usado pra iniciaziar o documento/pag
$(document).ready(function () {
    $("#display_date").html(display_date)
    //disbilitado enquanto o texto nao for digitado pelo usuario
    $('#save_button').prop('disabled', true);
})

let predicted_emotion;
$(function () {
    $("#predict_button").click(function () {
        let input_data = {
            "text": $("#text").val()
        }
        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                //na pag web a tag <p> recebe atualização
                $("#prediction").html(result.data.predicted_emotion)
                //a tag <img> recebe atualização
                $("#emo_img_url").attr('src', result.data.predicted_emotion_img_url);
                //estilos para as tags
                $('#prediction').css("display", "");
                $('#emo_img_url').css("display", "");
                //criado uma variavel armazenando o emotion da predição
                predicted_emotion = result.data.predicted_emotion
                //botão de salvar fica habilitado para salvarmos a informação do diario daquele dia
                $('#save_button').prop('disabled', false);
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });
    $("#save_button").click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion
        }
        $.ajax({
            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alert("Sua entrada foi salva com sucesso!")
                window.location.reload()
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });

    });
})

