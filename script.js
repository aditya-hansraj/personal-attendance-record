
class Subject {
    constructor(name, total = 0, attended = 0) {
        this.name = name;
        this.total = total;
        this.attended = attended;
        this.calculatePercentage();
    }

    calculatePercentage() {
        this.percentage = this.total === 0 ? 0 : (this.attended / this.total) * 100;
    }

    updateAttendance(attendedCount, totalCount) {
        this.attended = attendedCount;
        this.total = totalCount;
        this.calculatePercentage();
    }
}

// const subjects = {
//     CSW2: new Subject("CSW2"),
//     AD2: new Subject("AD2"),
//     COA: new Subject("COA"),
//     ALA: new Subject("ALA"),
//     UHV: new Subject("UHV")
// }


function updateAttendance(subject) {
    $('#attendance-form h1 span').text(subject);
    $('#updateAttendance-modal').show();
    $('#updateAttendance-modal .modal-content').fadeIn(100);

    $('#attendance-submit').off('click'); // Remove any existing click handlers
    $('#attendance-submit').on('click', () => {
        const selectedValue = $('input[name="attended"]:checked').val();
        let subjects = getAttendance();

        subjects[subject].total += 1;

        var att = subjects[subject].attended;
        att = parseInt(+att + +selectedValue);
        subjects[subject].attended = att;

        console.log(subjects[subject]);
        subjects[subject].calculatePercentage();

        localStorage.setItem("subjectsAttendance", JSON.stringify(subjects));
        displayAttendance(subject);
        updatePercentage();

        $('.attendance-label').removeClass('highlight');

        $('#updateAttendance-modal .modal-content').fadeOut(100);
        $('#updateAttendance-modal').hide();
    });
}

// function getAttendance() {
//     const storedAttendance = JSON.parse(localStorage.getItem("subjectsAttendance"));
//     if (storedAttendance) {
//         return storedAttendance;
//     }

// }

function getAttendance() {
    const storedAttendance = JSON.parse(localStorage.getItem("subjectsAttendance"));
    if (storedAttendance) {
        // Reconstruct Subject instances from stored data
        return Object.fromEntries(
            Object.entries(storedAttendance).map(([key, value]) => [key, new Subject(value.name, value.total, value.attended)])
        );
    }
    return null;
}

function displayAttendance(subject) {
    let subjects = getAttendance();

    let attended = subjects[subject].attended;
    let total = subjects[subject].total;
    let percentage = subjects[subject].percentage;

    $('#' + subject + ' .attended').text(attended);
    $('#' + subject + ' .total').text(total);
    $('#' + subject + ' .percentage-attendance').text(percentage);
}

function updatePercentage() {
    $('.percentage-attendance').each(function () {
        var attended = parseInt($(this).closest('tr').find('[class^="attended"]').text());
        var total = parseInt($(this).closest('tr').find('[class^="total"]').text());

        var percentage = total === 0 ? 0 : (attended / total) * 100;
        $(this).text(percentage.toFixed(2) + '%');

        if (percentage < 75) {
            $(this).removeClass('green-text');
            $(this).addClass('red-text');
        } else {
            $(this).removeClass('red-text');
            $(this).addClass('green-text');
        }
    });
}

async function closeModal() {
    await $('#nameModal .modal-content').slideUp(() => $('#nameModal').hide());
    location.reload();
}

function uploadAttendance() {
    localStorage.setItem("subjectsAttendance", JSON.stringify({
        CSW2: new Subject("CSW2"),
        AD2: new Subject("AD2"),
        COA: new Subject("COA"),
        ALA: new Subject("ALA"),
        UHV: new Subject("UHV")
    }));
}

async function saveName() {
    var userName = $('#userNameModal').val();

    if (userName) {
        uploadAttendance();
        localStorage.setItem('userName', userName);
        closeModal();
    } else {
        alert('Please enter your name.');
    }
}

function deleteUser() {
    localStorage.removeItem('userName');
    location.reload();
}

$(document).ready(function () {

    var subjects = getAttendance();
    console.log(subjects)

    displayAttendance('CSW2');
    displayAttendance('AD2');
    displayAttendance('COA');
    displayAttendance('ALA');
    displayAttendance('UHV');

    $('.attendance-label').on('click', function () {
        $('.attendance-label').removeClass('highlight');
        $(this).addClass('highlight');
    });

    updatePercentage();

    var savedName = localStorage.getItem('userName');

    if (savedName) {
        $('#header-name').text(savedName);
    } else {
        $('#nameModal').show();
        $('#nameModal .modal-content').slideDown(333);
    }

});

