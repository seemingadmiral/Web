$(document).ready(function () {
    var holding = [],
        moves,
        disksNum = 3, // Начальное количество дисков
        minMoves,
        optimalMoves,
        $canvas = $("#canvas"),
        $restart = $canvas.find(".restart"),
        $tower = $canvas.find(".tower"),
        $scorePanel = $canvas.find("#score-panel"),
        $movesCount = $scorePanel.find("#moves-num"),
        $ratingStars = $scorePanel.find("i"),
        rating = 3,
        $diskNumSelect = $("#disk-num");

    // Установить минимальное количество ходов в зависимости от количества дисков
    function calculateMinMoves(disks) {
        return Math.pow(2, disks) - 1;
    }
    
    // Функция для расчета оптимального количества ходов
    function calculateOptimalMoves(disks) {
        return Math.pow(2, disks) - 1;
    }
	
    // Функция для обновления подсказки
    function updateHint() {
        var movesDiff = optimalMoves - moves;
        var hint = movesDiff === 0 ? "Вы можете завершить игру за оптимальное количество ходов!" :
            "Оптимальное количество ходов: " + optimalMoves + ". Осталось ходов: " + movesDiff;
        $("#hint").text(hint);
    }
    
    // Инициализация игры
    function initGame(tower) {
        $tower.html("");
        moves = 0;
        $movesCount.html(0);
        holding = [];
        minMoves = calculateMinMoves(disksNum);
        optimalMoves = calculateOptimalMoves(disksNum); // Рассчитываем оптимальное количество ходов
        updateHint(); // Обновляем подсказку
        for (var i = 1; i <= disksNum; i++) {
            tower.prepend(
                $('<li class="disk disk-' + i + '" data-value="' + i + '"></li>')
            );
        }
        $ratingStars.each(function () {
            $(this).removeClass("fa-star-o").addClass("fa-star");
        });
    }

    // Логика игры, отвечает за подсчет и обновление количества ходов
    function countMove() {
        moves++;
        $movesCount.html(moves);

        if (moves >= minMoves) {
            if (//проверяется, находится ли на одной из башен полное количество дисков
                $tower.eq(1).children().length === disksNum ||
                $tower.eq(2).children().length === disksNum
            ) {
                Swal.fire({//вызывается всплывающее окно 
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    title: "Поздравляем! Вы выиграли!",
                    icon: "success",
                    confirmButtonColor: "#8bc34a",
                    confirmButtonText: "Играть снова!"
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        initGame($tower.eq(0));
                    }
                });
            }
        }
        updateHint();
    }
	// Отвечает за перемещение дисков между башнями
    function tower(tower) {
        var $disks = tower.children(),
            $topDisk = tower.find(":last-child"),
            topDiskValue = $topDisk.data("value"),
            $holdingDisk = $canvas.find(".hold");

        if ($holdingDisk.length !== 0) {
            if (topDiskValue === holding[0]) {//проверяется, подходит ли текущий диск для перемещения на другую башню
                $holdingDisk.removeClass("hold");
            } else if (topDiskValue === undefined || topDiskValue > holding[0]) {
                $holdingDisk.remove();
                tower.append(
                    $('<li class="disk disk-' + holding[0] + '" data-value="' + holding[0] + '"></li>')
                );
                countMove();
            }
        } else if ($topDisk.length !== 0) {
            $topDisk.addClass("hold");
            holding[0] = topDiskValue;
        }
    }

    // Инициализация игры с начальной башней
    initGame($tower.eq(0));

    // Обработчики событий
    $canvas.on("click", ".tower", function () {
        var $this = $(this);
        tower($this);
    });

    $restart.on("click", function () {
        Swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: "Вы уверены?",
            text: "Ваш прогресс будет потерян!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#8bc34a",
            cancelButtonColor: "#e91e63",
            confirmButtonText: "Да, начать заново!"
        }).then(function (isConfirm) {
            if (isConfirm) {
                initGame($tower.eq(0));
            }
        });
    });

    // Обработчик изменения количества дисков
    $diskNumSelect.on("change", function () {
        disksNum = parseInt($(this).val());
        initGame($tower.eq(0));
    });
});
