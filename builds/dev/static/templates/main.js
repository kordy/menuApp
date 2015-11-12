<div ng-controller="MenuController">

<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Меню "Fusion Service Group"</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#">Выход</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>

<div class="container-fluid">
<div class="row">
<div class="col-md-6 menu-wrapper">

    <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#menu">Продукты</a></li>
        <li><a data-toggle="tab" href="#blank">Бланки</a></li>
        <li><a data-toggle="tab" href="#excel">Обновить базу</a></li>
    </ul>

    <div class="tab-content">
        <div id="menu" class="tab-pane fade in active">

            <div class='highlight'>
                <table class="table table-striped table-hover table-condensed">
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th class=''>Количество</th>
                        <th class=''>Мера</th>
                        <th class='tar'>Цена</th>
                        <th class='tar'>Закуп. цена</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id="productsRegion">
                    <tr ng-repeat-start="product in menuDynamic" ng-init="$productIndex=$index"></tr>
                    <tr ng-repeat="gr in product.group"
                        ng-init="$groupIndex=$index"
                        data-group='{{gr.code}}'
                        ng-click='groupToggle(gr.code)'
                        ng-show='groupCheck(gr.code)'
                        ng-if='groupCompare(menuDynamic[$productIndex-1].group[$index], gr)'>
                        <th colspan=7>{{gr.code}}. {{gr.name}}</th>
                    </tr>

                    <tr ng-repeat-end
                        ng-show='groupProductCheck(product.group[product.group.length-1].code)'
                        ng-class='[
													{success: product.isCurrent},
													{warning: !product._id},
													{danger: product.isDelete},
												]'
                        data-group='{{product.group[product.group.length-1].code}}'
                            >
                        <td>
                            <input placeholder='Название' class='table-input' type='text' ng-model='product.name'>
                        </td>
                        <td>
                            <input placeholder='Количество' class='table-input table-input--count' type='text' ng-model='product.count'>

                        </td>
                        <td>
                            <input placeholder='Мера' class='table-input table-input--measure' type='text' ng-model='product.measure'>
                        </td>
                        <td>
                            <input placeholder='Цена' class='table-input table-input--price' type='text' ng-model='product.price'>
                            <span class='table-currency'>Р</span>
                        </td>
                        <td>
                            <input placeholder='Закупка' class='table-input table-input--price' type='text' ng-model='product.priceBase'>
                            <span class='table-currency'>Р</span>
                        </td>
                        <td><span ng-if='product._id && !product.isDelete'
                                  ng-click='productToggle(product)'
                                  ng-class="[   'glyphicon',
																	'pointer',
																	{'glyphicon-plus': !product.isCurrent},
																	{'glyphicon-minus': product.isCurrent}
																	]"
                                >

													  </span></td>
                        <td><span ng-click='productDeleteToggle(product)' class="pointer glyphicon glyphicon-remove"></span></td>
                    </tr>

                    </tbody>
                </table>
                <div class='prod-buttons'>
                    <button ng-click='menuAdd()' type="button" class="btn btn-success add-prod"><span class="glyphicon glyphicon-plus"></span>Добавить продукт</button>
                    <button ng-click='menuUpdate()' type="button" class="btn btn-default">Сохранить</button>
                </div>
            </div>


        </div>

        <div id="blank" class="tab-pane fade">

            <div class='highlight imageBlock'>

                <table class="table table-striped table-hover table-condensed">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Название</th>
                        <th>Удалить</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="image in images">
                        <td><img src='{{image.src}}' width=50></td>
                        <td> <input placeholder='Название' class='table-input' type='text' ng-model='image.name'></td>
                        <td><span class="glyphicon glyphicon-remove" ng-click='deleteImage(image)'></span></td>
                    </tr>
                    </tbody>
                </table>

                <div ng-controller="UploadImageController" class='ovh'>
                    <div class='btn btn-success image-add'>
                        <label class='pointer'>
                            <div class='uploadHeader'><span class=" glyphicon glyphicon-plus"></span> Добавить фон</div>
                            <input type="file" nv-file-select uploader="UploaderBg" class='upload-input'/>
                        </label>
                    </div>
                    <div class='btn btn-default image-save' ng-click='updateImages()'>Сохранить</div>
                    <ul class='upload-list'>
                        <li ng-repeat="item in UploaderBg.queue">
                            <span ng-bind="item.file.name"></span>
                            <button ng-click="item.upload()">Загрузить</button>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

        <div id="excel" class="tab-pane fade">
            <div class='highlight'>
                <div ng-controller="UploadXLSXController" class='ovh xlsx-controller'>
                    <div class='btn btn-success excel-add'>
                        <label class='pointer'>
                            <div class='uploadHeader'><span class=" glyphicon glyphicon-plus"></span> Загрузить Excel-файл</div>
                            <input type="file" nv-file-select uploader="uploaderXSLX" class='upload-input'/>
                        </label>
                    </div>
                    <ul class='upload-list'>
                        <li ng-repeat="item in uploaderXSLX.queue">
                            <span ng-bind="item.file.name"></span>
                            <button ng-click="item.upload()">Загрузить</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col-md-6">

    <div class="page-header prew-header">
        <h3 class='left'>Создание меню</h3>
    </div>

    <div class='highlight create-menu'>
        <form class="form-inline">
            <div class="form-group">
                <label>Название меню:</label>
                <input placeholder='Название меню' type='text' ng-model='menuCurrent.name' class='form-control'>
            </div>
            <div class="form-group">
                <label>Выбор из ранее сохранённых:</label>
                <select name="menuCurrent" class='form-control' id="menuSelect"
                        ng-options="menu.name for menu in menus"
                        ng-model="menuCurrent"
                        ng-change="menuSelect()"
                        ></select>
            </div>
            <div class="form-group">
                <label>Фоновое изображение:</label>
                <select class='form-control' id="imageSelect"
                        ng-options="image.name for image in images"
                        ng-model="menuCurrent.image"
                        ng-change="imageSelect()"
                        ></select>
            </div>
        </form>
    </div>

    <div ng-if='menuCurrent.name && menuCurrent.products[0]' class="btn-group right imp-btns" role="group" aria-label="...">
        <button ng-click='menuSave()' type="button" class="btn btn-success">Сохранить меню</button>
        <button ng-click='downloadPDF()' type="button" class="btn btn-success">Экспорт в PDF</button>
    </div>


    <div ng-if='menuCurrent.name && menuCurrent.products[0]' class="page-header prew-header">
        <h3 class='left'>Состав меню</h3>
    </div>
    <div ng-if='menuCurrent.name && menuCurrent.products[0]' class='highlight'>
        <table class="table table-striped table-hover table-condensed">
            <thead>
            <tr>
                <th>Название</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Закуп. цена</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr ng-repeat-start="productCurrent in menuCurrent.products"
                ng-click='productToggle(productCurrent)'
                ng-if='groupCompare(menuCurrent.products[$index-1].group[0], productCurrent.group[0])'
                    >
                <th colspan=5>{{productCurrent.group[0].name}}</th>
            </tr>
            <tr ng-click='productToggle(productCurrent)' ng-repeat-end>
                <td>{{productCurrent.name}}</td>
                <td>{{productCurrent.count}} {{productCurrent.measure}}</td>
                <td>{{productCurrent.price}} Р</td>
                <td>{{productCurrent.priceBase}} Р</td>
                <td><span class="glyphicon glyphicon-ok"></span></td>
            </tr>
            </tbody>
        </table>
    </div>

    <!--<div ng-if='menuCurrent.name && menuCurrent.products[0]' ng-click='menuSave()' class='bg-success block block--active tac pointer'>Сохранить</div>-->

    <!--<div ng-if='menuCurrent.name && menuCurrent.products[0]' ng-click='downloadPDF()' class='bg-success block block--active tac pointer'>Сохранить в PDF</div>-->
    <!--<div ng-if='menuCurrent.name && menuCurrent.products[0]' ng-click='getPDF()' class='bg-success block block--active tac pointer'>Просмотр PDF</div>-->
    <div id='pdfContainer'></div>

    <div ng-if='menuCurrent.name && menuCurrent.products[0]' class="page-header prew-header">
        <h3 class='left'>Предпросмотр</h3>
    </div>
    <div ng-if='menuCurrent.name && menuCurrent.products[0]' class='highlight' style='min-height:200px;clear:both;'>
        <h1 style='text-align:center;'>Предпросмотр меню! <br> <small>(в разработке)</small></h1>
    </div>

</div>
</div>
</div>
</div>