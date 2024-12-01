class Certificate {
  constructor() {
    this.settings = {};
  }
}

class CertificateModel {
  constructor() {
    this.certificate = null;
    this.textBlocks = {};
    this.nextTextBlockId = 0;
  }

  createCertificate(imageName, imageWidth, imageHeight) {
    this.certificate = new Certificate();
    this.certificate.settings = {
      title: "Сертификат",
      img: imageName,
      size_x: imageWidth,
      size_y: imageHeight,
      text_lines: {}
    };
  }

  deleteCertificate() {
    this.certificate = null;
    this.textBlocks = {};
    this.nextTextBlockId = 0;
  }

  getNextTextBlockId() {
    return this.nextTextBlockId;
  }

  getCertificateSettings() {
    return this.certificate.settings;
  }

  getCertificateTitle() {
    return this.certificate.settings.title;
  }

  getCertificateImageWidth() {
    return this.certificate.settings.size_x;
  }

  getCertificateImageHeight() {
    return this.certificate.settings.size_y;
  }

  getCertificateImageSize() {
    return {
      width: this.certificate.settings.size_x,
      height: this.certificate.settings.size_y
    };
  }

  getTextBlockSettings(textBlockId) {
    return this.textBlocks[textBlockId];
  }

  setCertificateTitle(certificateTitle) {
    this.certificate.settings.title = certificateTitle;
  }

  addTextBlock() {
    this.textBlocks[++this.nextTextBlockId] = {
      "font": null,
      "font-size": null,
      "line-width": null,
      "start-x": null,
      "start-y": null,
      "line-spacing": null,
      "text": null,
      "color": [],
      "align": null,
      "content": "Добавить Текст",
      "text-case": null,
      "text-bold": false,
      "text-italic": false,
      "text-underlined": false
    };
    this.updateTextBlockInCertificateSettings(this.nextTextBlockId);
    return this.nextTextBlockId;
  }

  deleteTextBlock(textBlockId) {
    delete this.textBlocks[textBlockId];
    delete this.certificate.settings.text_lines[textBlockId];
  }

  setTextBlockCoords(textBlockId, textBlockXCoord, textBlockYCoord) {
    this.textBlocks[textBlockId]["start-x"] = textBlockXCoord;
    this.textBlocks[textBlockId]["start-y"] = textBlockYCoord;
    this.updateTextBlockInCertificateSettings(textBlockId);
  }

  setTextBlockWidth(textBlockId, textBlockWidth) {
    this.textBlocks[textBlockId]["line-width"] = textBlockWidth;
    this.updateTextBlockInCertificateSettings(textBlockId);
  }

  setTextBlockContent(textBlockId, textBlockContent) {
    this.textBlocks[textBlockId]["content"] = textBlockContent;
    console.log(this.textBlocks);
  }

  updateTextBlockSettings(textBlockId, fontSize, letterSpacing) {
    const textBlock = $(`#text-block_${textBlockId}`);

    this.textBlocks[textBlockId] = {
      font: textBlock.css("font-family"),
      "font-size": fontSize,
      "line-spacing": letterSpacing,
      text: '{$' + $('#block-type').val() + '}',
      color: textBlock.css("color"),
      align: textBlock.css("text-align"),
      "text-case": textBlock.css("text-transform"),
    };

    console.log(this.textBlocks[textBlockId]);
  }

  updateTextBlockInCertificateSettings(textBlockId) {
    if (!this.certificate.settings[textBlockId]) {
      this.certificate.settings[textBlockId] = {};
    }
    for (let property in this.textBlocks[textBlockId]) {
      if (property === 'content') break;
      this.certificate.settings[textBlockId][property] = this.textBlocks[textBlockId][property];
    }
    console.log(this.certificate.settings);
  }


}

class CertificateView {
  constructor() {
    this.init();
    this.pxToPtRatio = 0.75;
  }

  init() {
    this.resetInterface()
  }

  setWorkingImage(trueWorkingImageWidth, trueWorkingImageHeight) {
    this.workingImage = $('#working-img');
    this.trueWorkingImageWidth = trueWorkingImageWidth;
    this.trueWorkingImageHeight = trueWorkingImageHeight;
  }

  resetInterface() {
    this.renderBaseLayout();
    this.renderLeftPanelLayout();
    this.renderTextToolbar();
    this.renderImageUploadField();
  }

  renderBaseLayout() {
    const baseLayoutHtml = `
      <!-- Левая панель -->
      <aside id="panel-left" class="d-flex flex-column justify-content-between gap-4 bg-white rounded p-2"></aside>
      <!-- Центральная панель -->
      <main id="panel-center" class="d-flex justify-content-center align-items-center p-2"></main>
      <!-- Правая панель -->
      <aside id="panel-right" class="d-flex flex-column gap-2 bg-white rounded p-2"></aside>`;
    $('#container-fluid').html(baseLayoutHtml);
  }

  renderLeftPanelLayout() {
    const leftPanelLayoutHtml = `
      <!-- Панель управления текстом -->
      <div id="text-controls" class="d-flex flex-column align-items-stretch gap-2">
        <div class="btn-tooltip mb-3" data-toggle="tooltip" title="Пожалуйста, вначале загрузите сертификат">
          <button id="new-text-btn" class="w-100 btn btn-primary btn-lg ellipsis" type="button" disabled>Добавить Текст</button>
        </div>
      </div>
      <!-- Панель управления импортом/экспортом -->
      <div id="import-export-controls" class="d-flex flex-column align-items-stretch gap-2">
        <div class="btn-tooltip" data-toggle="tooltip" title="Пожалуйста, вначале загрузите сертификат">
          <button id="import-btn" class="w-100 btn btn-primary btn-lg ellipsis" type="button" disabled>Импортировать JSON</button>
        </div>
        <div class="btn-tooltip" data-toggle="tooltip" title="Пожалуйста, вначале загрузите сертификат">
          <button id="export-btn" class="w-100 btn btn-primary btn-lg ellipsis" type="button" disabled>Экспортировать в JSON</button>
        </div>
      </div>`;
    $('#panel-left').html(leftPanelLayoutHtml);
    $('[data-toggle="tooltip"]').tooltip({
      placement: 'right'
    });
  }

  renderTextToolbar() {
    const textToolbarHtml = `
      <!-- Текстовый редактор -->
      <form id="text-toolbar" class="d-flex flex-column gap-2">
        <div class="d-flex gap-2">
          <div class="form-group w-75">
            <select id="font-family" class="text-toolbar-item w-100 p-2 rounded ellipsis" title="Шрифт">
              <optgroup label="Your fonts" id="new-fonts-group" class="d-none"></optgroup>
              <optgroup label="Sans-Serif">
                <option>sansserif</option>
                <option>Arial</option>
                <option>Verdana</option>
                <option selected>Montserrat</option>
              </optgroup>
              <optgroup label="Serif">
                <option>serif</option>
                <option>Times New Roman</option>
                <option>Georgia</option>
              </optgroup>
              <optgroup label="Monospace">
                <option>monospace</option>
                <option>Andale Mono</option>
                <option>Courier</option>
              </optgroup>
              <optgroup label="Cursive">
                <option>cursive</option>
                <option>Comic Sans</option>
              </optgroup>
              <optgroup label="Fantasy">
                <option>fantasy</option>
                <option>Impact</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group w-25">
            <input id="upload-font" accept=".ttf, .otf, .woff, .woff2" type="file" hidden>
            <button id="new-font-btn" class="text-toolbar-item h-100 btn btn-primary ellipsis" type="button">Добавить</button>
          </div>
        </div>
        <div class="d-flex gap-2">
          <div class="form-group w-50">
            <select id="text-case" class="text-toolbar-item w-100 rounded ellipsis p-2" title="Регистр">
              <option data-text-case="none">Как в предложении</option>
              <option data-text-case="lowercase">все строчные</option>
              <option data-text-case="uppercase">ВСЕ ПРОПИСНЫЕ</option>
              <option data-text-case="capitalize">Начинать С Прописных</option>
            </select>
          </div>
          <div class="form-group w-25">
            <input id="font-size" type="number" class="text-toolbar-item w-100 h-100 rounded p-2" title="Размер шрифта" min="8"
              max="100" step="0.5">
          </div>
          <div class="form-group w-25">
            <input id="letter-spacing" type="number" class="text-toolbar-item w-100 h-100 rounded p-2" title="Межбуквенное расстояние"
              min="-100" max="100" step="0.1">
          </div>
        </div>
        <div class="form-group w-100">
          <div id="text-edit-btns" class="d-flex justify-content-between gap-2 flex-wrap">
            <input id="text-bold" type="checkbox" class="btn-check">
            <label for="text-bold" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/text-bold.png" alt="Bold text">
            </label>
            <input id="text-italic" type="checkbox" class="btn-check">
            <label for="text-italic" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/text-italic.png" alt="Italic text">
            </label>
            <input id="text-underlined" type="checkbox" class="btn-check">
            <label for="text-underlined" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/text-underlined.png" alt="Underlined text">
            </label>
            <input id="align-left" type="radio" class="align-radio btn-check" name="text-align" data-text-align="left">
            <label for="align-left" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/align_left.png" alt="Выровнять текст влево">
            </label>
            <input id="align-center" type="radio" class="align-radio btn-check" name="text-align"
              data-text-align="center">
            <label for="align-center" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/align_center.png" alt="Выровнять текст по центру">
            </label>
            <input id="align-right" type="radio" class="align-radio btn-check" name="text-align"
              data-text-align="right">
            <label for="align-right" class="text-toolbar-item btn btn-outline-secondary rounded p-2">
              <img src="./imgs/align_right.png" alt="Выровнять текст вправо">
            </label>
            <input id="text-color" type="color" class="text-toolbar-item btn btn-outline-secondary form-control-color rounded h-100 p-2"
              value="#000000" title="Цвет текста">
          </div>
        </div>
        <div class="d-flex gap-2">
          <div class="form-group w-50">
            <input id="block-type" type="text" class="text-toolbar-item w-100 h-100 rounded p-2" title="Категория блока" minlength="2"
              maxlength="50" value="text" autocomplete="off">
          </div>
          <div class="form-group w-25">
            <input id="x_coord" type="number" class="text-toolbar-item block-coords w-100 h-100 rounded p-2"
              title="Координата блока по X" min="0" autocomplete="off">
          </div>
          <div class="form-group w-25">
            <input id="y_coord" type="number" class="text-toolbar-item block-coords w-100 h-100 rounded p-2"
              title="Координата блока по Y" min="0" autocomplete="off">
          </div>
        </div>
      </form>`;
    $('#text-controls').append(textToolbarHtml);
  }

  renderImageUploadField() {
    const imageDropzoneHtml = `
      <!-- Поле для загрузки изображения -->
      <div id="img-dropzone" class="dropzone d-flex flex-column align-items-center rounded p-3 py-5">
        <div class="cross mb-5"></div>
        <span class="drop-message text-center">Перетащите сюда сертификат или нажмите для выбора сертификата</span>
        <input type="file" id="upload-img" accept="image/*" hidden>
      </div>`;
    $('#panel-center').html(imageDropzoneHtml);
  }

  renderWorkspace() {
    const workspaceHtml = `
      <!-- Рабочая область -->
      <div id="workspace" class="h-100 w-100 p-0 w-0 d-flex justify-content-center align-items-center position-relative"></div>`;
    $('#panel-center').html(workspaceHtml);
  }

  renderWorkingImage(imageUrl, callback) {
    if (typeof callback === 'function') {
      const $workingImage = $(`<img src="${imageUrl}" id="working-img" alt="Certificate Image" class="mw-100 w-auto mh-100 h-auto d-block">`);
      $('#workspace').html($workingImage);
      $workingImage.on('load', () => {
        callback($workingImage[0]);
      });
    } else {
      console.error("Ошибка: не удалось загрузить изображение.");
    }
  }

  renderCertificateThumbnail(imageUrl, certificateTitle) {
    const certificateThumbnailHtml = `
      <div id="certificate-thumbnail" class="d-flex flex-column justify-content-start align-items-center gap-2 border border-secondary rounded p-2">
        <div id="certificate-title" class="w-100 d-flex fw-bold text-truncate">
          <span class="w-100 text-center ellipsis">${certificateTitle}</span>
        </div>
        <img id="certificate-img" class="w-100 rounded" src="${imageUrl}">
        <button id="delete-certificate-btn" class="w-100 btn btn-danger ellipsis" type="button">Удалить</button>
      </div>`;
    $('#panel-right').html(certificateThumbnailHtml);
  }

  renderAxes() {
    const axesHtml = `
    <hr id="vertical-axis" class="axis text-primary opacity-75 m-0 d-none">
    <hr id="horizontal-axis" class="axis text-primary opacity-75 m-0 d-none">`;
    $('#workspace').append(axesHtml);
    this.resizeAxes();
  }

  renderTextBlock(textBlockId) {
    const textBlock = $(`<div id="text-block-${textBlockId}" class="text-block text-black text-start border border-dark px-1">Добавить Текст</div>`);
    $('#workspace').append(textBlock);
    $(document).trigger('textBlockCreated', [textBlockId]);
    this.makeTextBlockDraggable(textBlock, textBlockId);
    this.makeTextBlockResizable(textBlock, textBlockId);
    this.setTextBlockActive(textBlockId);
  }

  renderTextLayer(textLayerId) {
    const textLayerHtml = `
    <div id="text-layer-${textLayerId}"
      class="text-layer p-2 d-flex flex-column align-items-center gap-2 border border-dark rounded ">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <span class="w-100 fw-bold text-truncate ellipsis">Слой &#8470;${textLayerId}</span>
        <button id="delete-text-${textLayerId}" class="btn btn-sm btn-danger p-0 px-2" type="button">&#x2716;</button>
      </div>
      <div class="w-100 d-flex justify-content-center text-truncate">
        <span class="ellipsis">Добавить Текст</span>
      </div>
    </div>`;
    $('#panel-right').append(textLayerHtml);

    this.setTextLayerActive(textLayerId);
    this.scrollRightPanelToBottomContent();
  }

  setTextBlockActive(textBlockId) {
    $('.text-block').removeClass('border-primary').addClass('border-dark');
    $(`#text-block-${textBlockId}`).removeClass('border-dark').addClass('border-primary');
  }

  setTextLayerActive(textLayerId) {
    $('.text-layer').removeClass('border-primary').removeClass('bg-primary').removeClass('text-white')
      .addClass('border-dark').addClass('text-dark');
    $(`#text-layer-${textLayerId}`).removeClass('border-dark').removeClass('text-dark')
      .addClass('border-primary').addClass('bg-primary').addClass('text-white');
  }

  enableControls() {
    $('#new-text-btn, #import-btn, #export-btn').prop('disabled', false);
    $('#new-text-btn, #import-btn, #export-btn').parent().tooltip('disable');
  }

  enableCertificateTitleEditing() {
    const currentCertificateTitle = $.trim($('#certificate-title').text());
    $('#certificate-title')
      .addClass('active')
      .html(`<input id="certificate-editable-title" class="editable w-100 text-primary text-center fw-bold border-0 bg-transparent m-0 p-0" type="text" value="${currentCertificateTitle}" autocomplete="off">`);
    $('#certificate-editable-title').focus();
  }

  enableTextBlockContentEditing(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);
    const currentTextBlockContent = $.trim(textBlock.text());
    const textarea = $(`<textarea id="text-block-editable-content" rows="1" class="editable text-primary border-0 bg-transparent m-0 p-0" style="width: ${textBlock.width()}px" type="text">${currentTextBlockContent}</textarea>`);
    textBlock.addClass('active').html(textarea);
    textarea.on('input', function () {
      this.style.height = this.scrollHeight + 'px';
    }).trigger('input');
    textarea.focus();
  }

  unlockTextToolbar() {
    $('.text-toolbar-item').addClass('selectable');
  }

  updateCertificateTitle(certificateTitle) {
    $('#certificate-title').removeClass('active').html(`<span class="w-100 text-center ellipsis">${certificateTitle}</span>`);
  }

  updateTextBlockContent(textBlockId, textBlockContent) {
    const textBlock = $(`#text-block-${textBlockId}`);
    textBlock.width(textBlock.width()).css('min-height', textBlock.css('min-height'));
    textBlock.removeClass('active').empty().text(textBlockContent);
    this.makeTextBlockResizable(textBlock, textBlockId);
  }

  updateTextToolbar(textBlockSettings) {
    $('.text-toolbar-item').removeClass('checked').find('input').prop('checked', false);
    $('.text-toolbar-item select').val('');

    $('#font-family').val(textBlockSettings.font);
    $('#font-size').val(textBlockSettings[font-size]);
    $('#letter-spacing').val(textBlockSettings[line-spacing]);
    $('#text-color').val(rgbToHex(textBlockSettings.color));
    $('#block-type').val(textBlockSettings.text.replace(/{\$|}/g, ''));
    $('#x_coord').val(textBlockSettings[start-x]);
    $('#y_coord').val(textBlockSettings[start-y]);

    $('#text-case').find(`option[data-text-case="${textBlockSettings['text-case']}"]`).prop('selected', true);

    $('#text-bold').prop('checked', textBlockSettings[text-bold]);
    $('#text-italic').prop('checked', textBlockSettings[text-italic]);
    $('#text-underlined').prop('checked', textBlockSettings[text-underlined]);

    $('#align-center').prop('checked', textBlockSettings.align === 'center');
    $('#align-right').prop('checked', textBlockSettings.align === 'right');
    $('#align-left').prop('checked', textBlockSettings.align === 'left');
    
    // if (textBlockSettings.align === 'center') {
    //   $('#align-center').prop('checked', true);
    // } else if (textBlockSettings.textAlign === 'right') {
    //   $('#align-right').prop('checked', true);
    // } else {
    //   $('#align-left').prop('checked', true);
    // }

    $('.text-toolbar-item').each(function () {
      const element = $(this);
      if (element.is(':checkbox, :radio')) {
        if (element.is(':checked')) {
          element.parent('.text-toolbar-item').addClass('checked');
        } else {
          element.parent('.text-toolbar-item').removeClass('checked');
        }
      }
    });
  }

  removeTextBlock(textBlockId) {
    $(`#text-block-${textBlockId}`).remove();
  }

  removeTextLayer(textLayerId) {
    $(`#text-layer-${textLayerId}`).remove();
  }

  makeTextBlockDraggable(textBlock, textBlockId) {
    const verticalLine = $('#vertical-axis');
    const horizontalLine = $('#horizontal-axis');

    textBlock.draggable({
      cursor: "move",
      grid: [1, 1],
      containment: $('#working-img'),
      snap: true,
      snapMode: "outer",
      snapTolerance: 10,
      start: () => {
        verticalLine.removeClass('d-none');
        horizontalLine.removeClass('d-none');
      },
      drag: function (event, ui) {
        const blockPosition = ui.position;
        const blockWidth = ui.helper.outerWidth();
        const blockHeight = ui.helper.outerHeight();
        const verticalLinePosition = verticalLine.position().left;
        const horizontalLinePosition = horizontalLine.position().top;

        ui.position.left = this.snapTextBlockToAxis(verticalLinePosition, blockWidth, blockPosition.left);
        ui.position.top = this.snapTextBlockToAxis(horizontalLinePosition, blockHeight, blockPosition.top);
      }.bind(this),
      stop: () => {
        verticalLine.addClass('d-none');
        horizontalLine.addClass('d-none');
        $(document).trigger('textBlockDragged', [textBlockId]);
      },
    });
  }

  makeTextBlockResizable(textBlock, textBlockId) {
    textBlock.resizable({
      cursor: "ew-resize",
      grid: [1, 1],
      containment: $('#working-img'),
      handles: "e, w",
      stop: () => {
        $(document).trigger('textBlockResized', [textBlockId]);
      }
    });
  }

  snapTextBlockToAxis(axisPosition, blockSize, blockPosition) {
    const snapThreshold = 10;
    if (Math.abs(blockPosition - axisPosition) <= snapThreshold) {
      return axisPosition;
    } else if (Math.abs(blockPosition + blockSize - axisPosition) <= snapThreshold) {
      return axisPosition - blockSize;
    } else if (Math.abs(blockPosition + (blockSize / 2) - axisPosition) <= snapThreshold) {
      return axisPosition - (blockSize / 2);
    }
    return blockPosition;
  }

  getTextBlockCoords(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);
    const ratios = this.calculateRatios();
    const relativeCoords = {
      X: this.roundToFixDecimalPlace((textBlock.offset().left - this.workingImage.offset().left) * ratios.horizontal),
      Y: this.roundToFixDecimalPlace((textBlock.offset().top - this.workingImage.offset().top) * ratios.vertical)
    };

    return relativeCoords;
  }

  getTextBlockWidth(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);
    const ratios = this.calculateRatios();
    return this.roundToFixDecimalPlace(textBlock.width() * ratios.horizontal);
  }

  getTextBlockFontSize(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);
    const ratios = this.calculateRatios();
    return this.roundToNearestHalfOrInt(parseFloat(textBlock.css("font-size")) * this.pxToPtRatio * ratios.vertical);
  }

  getTextBlockLetterSpacing(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);
    const ratios = this.calculateRatios();
    return this.roundToNearestHalfOrInt(parseFloat(textBlock.css("letter-spacing")) * this.pxToPtRatio * ratios.vertical);
  }




  scrollRightPanelToBottomContent() {
    const rightPanel = $('#panel-right');
    rightPanel.animate({ scrollTop: rightPanel.prop("scrollHeight") }, 500);
  }

  resizeAxes() {
    const imageWidth = this.workingImage.width();
    const imageHeight = this.workingImage.height()
    $('#horizontal-axis').css({
      width: imageWidth,
      transform: `translate(${imageWidth / -2}px)`
    });
    $('#vertical-axis').css({
      width: imageHeight,
      transform: `translate(${imageHeight / -2}px) rotate(90deg)`
    });
  }

  calculateRatios() {
    const horizontalRatio = this.trueWorkingImageWidth / this.workingImage.width();
    const verticalRatio = this.trueWorkingImageHeight / this.workingImage.height();
    return { horizontal: horizontalRatio, vertical: verticalRatio };
  }

  roundToFixDecimalPlace(number, place = 1) {
    return Math.round(number * place * 10) / (place * 10);
  }

  roundToNearestHalfOrInt(number) {
    return Math.round(number * 2) / 2;
  }

  rgbToHex(rgb) {
    const r = rgb[0].toString(16).padStart(2, '0');
    const g = rgb[1].toString(16).padStart(2, '0');
    const b = rgb[2].toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

}

class CertificateController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    $(document).on('textBlockDragged', this.onTextBlockDragged.bind(this));
    $(document).on('textBlockResized', this.onTextBlockResized.bind(this));
  }

  init() {
    this.setupImageUploadHandlers();
  }

  onTextBlockDragged(event, textBlockId) {
    this.updateTextBlockCoords(textBlockId);
  }

  onTextBlockResized(event, textBlockId) {
    this.updateTextBlockWidth(textBlockId);
  }

  setupImageUploadHandlers() {
    const uploadImg = $('#upload-img');
    const dropzone = $('#img-dropzone');

    dropzone.on('click', () => { uploadImg[0].click(); });

    uploadImg.on('change', (event) => this.handleFileSelect(event.target.files));

    ['dragenter', 'dragover'].forEach(eventType => {
      dropzone.on(eventType, (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.addClass('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventType => {
      dropzone.on(eventType, (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.removeClass('dragover');
      });
    });

    dropzone.on('drop', (event) => {
      const files = event.originalEvent.dataTransfer.files;
      this.handleFileSelect(files);
    });
  }

  handleFileSelect(files) {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      this.handleImageUpload(file);
    } else {
      console.error("Ошибка: выбранный файл не является изображением.");
    }
  }

  handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      this.view.renderWorkspace();
      this.view.renderWorkingImage(imageUrl, (imageElement) => {
        this.view.setWorkingImage(imageElement.naturalWidth, imageElement.naturalHeight);
        this.model.createCertificate(file.name, imageElement.naturalWidth, imageElement.naturalHeight);
        this.view.renderCertificateThumbnail(imageUrl, this.model.getCertificateTitle());
        this.setupСertificateThumbnailHandlers();
        this.view.enableControls();
        this.setupControlsHandlers();

        this.view.renderAxes();
        this.setupAxesResizeEvent();
      });
    };
    reader.readAsDataURL(file);
  }

  setupAxesResizeEvent() {
    $(window).on('resize', () => {
      this.view.resizeAxes();
    });
  }

  setupСertificateThumbnailHandlers() {
    $('#certificate-title').on('dblclick', this.handleRenameCertificate.bind(this));
    $('#delete-certificate-btn').on('click', this.handleDeleteCertificate.bind(this));
  }

  handleRenameCertificate() {
    if (!($('#certificate-title').hasClass('active'))) {
      this.view.enableCertificateTitleEditing();
      this.setupCertificateTitleInputHandlers();
    }
  }

  setupCertificateTitleInputHandlers() {
    $('#certificate-editable-title').on('blur', (event) => {
      const newCertificateTitle = $(event.currentTarget).val();
      this.view.updateCertificateTitle(newCertificateTitle);
      this.model.setCertificateTitle(newCertificateTitle);
    });

    $('#certificate-editable-title').on('keydown', (event) => {
      if (event.which === 13) {
        $(event.currentTarget).blur();
      }
    });
  }

  handleDeleteCertificate() {
    this.model.deleteCertificate();
    this.view.resetInterface();
    this.setupImageUploadHandlers();
  }

  setupControlsHandlers() {
    $('#new-text-btn').on('click', this.handleAddTextBlock.bind(this));
    $('#import-btn').on('click', this.handleImportJson.bind(this));
    $('#export-btn').on('click', this.handleExportJson.bind(this));
  }

  handleAddTextBlock() {
    const textBlockId = this.model.addTextBlock();
    this.view.renderTextBlock(textBlockId);
    this.setupTextBlockClickHandlers(textBlockId);
    this.view.renderTextLayer(textBlockId);
    this.setupTextLayerClickHandlers(textBlockId);
    this.view.unlockTextToolbar();
    this.model.updateTextBlockSettings(textBlockId, this.view.getTextBlockFontSize(textBlockId), this.view.getTextBlockLetterSpacing(textBlockId))
    this.view.updateTextToolbar(this.model.getTextBlockSettings(textBlockId));
    
  }

  setupTextBlockClickHandlers(textBlockId) {
    const textBlock = $(`#text-block-${textBlockId}`);

    textBlock.on('dblclick', () => {
      this.handleChangeTextBlockContent(textBlockId);
    });

    textBlock.on('mousedown', () => {
      textBlock.addClass('border-dashed');
      this.view.setTextBlockActive(textBlockId);
      this.view.setTextLayerActive(textBlockId)
    });

    textBlock.on('mouseup', () => {
      textBlock.removeClass('border-dashed');
    });
  }

  handleChangeTextBlockContent(textBlockId) {
    if (!($(`#text-block-${textBlockId}`).hasClass('active'))) {
      this.view.enableTextBlockContentEditing(textBlockId);
      this.setupTextBlockContentInputHandlers(textBlockId);
    }
  }

  setupTextBlockContentInputHandlers(textBlockId) {
    $('#text-block-editable-content').on('blur', (event) => {
      const newTextBlockContent = $(event.currentTarget).val();
      this.view.updateTextBlockContent(textBlockId, newTextBlockContent);
      this.model.setTextBlockContent(textBlockId, newTextBlockContent);
    });

    $('#text-block-editable-content').on('keydown', (event) => {
      if (event.which === 13) {
        $(event.currentTarget).blur();
      }
    });
  }

  updateTextBlockCoords(textBlockId) {
    const textBlockCoords = this.view.getTextBlockCoords(textBlockId);
    this.model.setTextBlockCoords(textBlockId, textBlockCoords.X, textBlockCoords.Y);
  }

  updateTextBlockWidth(textBlockId) {
    const textBlockWidth = this.view.getTextBlockWidth(textBlockId)
    this.model.setTextBlockWidth(textBlockId, textBlockWidth);
  }

  setupTextLayerClickHandlers(textLayerId) {
    $(`#text-layer-${textLayerId}`).on('click', () => {
      this.view.setTextLayerActive(textLayerId)
      this.view.setTextBlockActive(textLayerId);
    });

    $(`#delete-text-${textLayerId}`).on('click', () => {
      this.model.deleteTextBlock(textLayerId);
      this.view.removeTextBlock(textLayerId);
      this.view.removeTextLayer(textLayerId);
    });
  }

  handleImportJson() {

  }

  handleExportJson() {
    const jsonString = JSON.stringify(this.model.getCertificateSettings(), null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = $(`<a href="${url}" download="Settings.json" class="d-none"></a>`).appendTo('body');
    downloadAnchor[0].click();
    URL.revokeObjectURL(url);
    downloadAnchor.remove();
  }

}

$(document).ready(function () {
  const model = new CertificateModel();
  const view = new CertificateView();
  const controller = new CertificateController(model, view);
  controller.init();
});