    let cardCount = 20, row = 5, column = Math.floor(cardCount/5), pair = -1, pairindex = -1;
    let arrDeck = [];
    let iconSets = [
        '🎁', '🎉', '🎊', '🎈', '🎂',
        '💎', '🌟', '💫', '✨', '🌠',
        '🔑', '🚀', '🛸', '⚓', '⛵',
        '🛠', '🔧', '🔩', '🔨', '🪚',
        '🍎', '🍌', '🍉', '🍇', '🍓'
    ];

    document.addEventListener('DOMContentLoaded', () => {
        cardCount = row * column;
        document.documentElement.style.setProperty('--row', row);

        // UI 생성
        for(let i = 0; i < cardCount; i++) {
            let el = document.createElement('div');
            el.id = 'card' + i;
            el.classList.add('card');
            document.querySelector('.gameboard').appendChild(el);
        }

        // 클릭 이벤트 핸들러
        document.querySelector('.gameboard').addEventListener('click', (e) => {
            if(e.target.classList.contains('card') && e.target.classList.contains('back')) {
                console.log('clicked');
                e.target.classList.remove('back');
                e.target.classList.add('front');
            }
        });

        // 애니메이션 완료 핸들러
        document.querySelector('.gameboard').addEventListener('transitionend', (e) => {
            if(e.target.classList.contains('card')) {
                console.log('transitionended');
                if(e.target.classList.contains('front')) {
                    if(pair < 0) {
                        pair = e.target.dataset.number;
                        pairindex = e.target.dataset.index;
                    } else {
                        if(pair == e.target.dataset.number && pairindex != e.target.dataset.index) {
                            // 매치됨 - 컬러링
                            document.querySelectorAll('.gameboard .card.front').forEach((card) => {
                                card.classList.add('matched');
                            });
                            pair = -1;
                            pairindex = -1;
                            if(document.querySelector('.gameboard .card:not(.matched)') == null) {
                                // 완료
                                console.log('card finding end.');
                                doneFinding();
                            }
                        } else if(pairindex != e.target.dataset.index) {
                            // 매치 안됨 - 페어 리셋
                            document.querySelectorAll('.gameboard .card.front:not(.matched)').forEach((card) => {
                                card.classList.remove('front');
                                card.classList.add('back');
                            });
                            pair = -1;
                            pairindex = -1;
                        }
                    }
                }            
            }
        });

        // 배열 셔플
        reShuffle(false);
        // 정보 초기화
        initCard();
    });

    function initCard() {
        // 카드에 셔플 숫자 지정
        document.querySelectorAll('.gameboard .card').forEach((card, idx) => {
            card.dataset.number = arrDeck[idx].number;
            card.dataset.index = idx;
            card.innerHTML = arrDeck[idx].icon;
        });

        // 초기화 애니메이션
        let init = window.setInterval(() => {
            let card = document.querySelector('.gameboard .card:not(.back)');
            if(card) {
                card.classList.remove('front');
                card.classList.remove('matched');
                card.classList.add('back');
                card.innerHTML = '';
            } else {
                window.clearInterval(init);
            }
        }, 50);
    }

    function reShuffle(bReInit) {
        if(!bReInit) {
            for(let i = 0; i < Math.floor(cardCount / 2); i++) {
                let icon = iconSets[i % iconSets.length];
                arrDeck.push({ number: i + 1, icon: icon });
                arrDeck.push({ number: i + 1, icon: icon });
            }
        }
        arrDeck = fyShuffler(arrDeck);
    }

    const fyShuffler = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor((i + 1) * Math.random());
            [arr[i], arr[j]] = [arr[j], arr[i]]; // 배열 값 교환
        }
        return arr;
    }

    function doneFinding() {
        if(confirm('찾기 완료! 게임을 다시 하시겠습니까?')) {
            reShuffle(true);
            initCard();
        }
    }
