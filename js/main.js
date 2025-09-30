 //start cha
// بيانات تجريبية
    const mockStudents = [
      { 
        id: 'stu-101', 
        name: 'أحمد محمد', 
        grade: 'العاشر', 
        results: [
          {subject:'رياضيات',study:20,oral:15,homework:25,exam:30},
          {subject:'علوم',study:18,oral:20,homework:20,exam:25},
          {subject:'عربي',study:22,oral:18,homework:20,exam:30}
        ], 
        notes: [{text:'يحتاج لتحسين الواجبات',date:'2024-01-10'}], 
        exams: [{title:'نموذج رياضيات - ديسمبر',file:'math_dec.pdf',date:'2024-12-01'}] 
      }
    ];

    const paramId = new URL(window.location.href).searchParams.get('id');
    const STUDENT = mockStudents.find(s=> s.id === paramId) || mockStudents[0];

    function renderProfile(){
      document.querySelector('#stuName').textContent = STUDENT.name;
      document.querySelector('#stuGrade').textContent = STUDENT.grade;
      document.querySelector('#stuIdBadge').textContent = 'ID: ' + STUDENT.id;
      document.querySelector('#avatar').textContent = STUDENT.name.split(' ')[0].charAt(0) || 'ط';
      document.querySelector('#infoGrade').textContent = STUDENT.grade;
      document.querySelector('#infoUpdated').textContent = new Date().toLocaleDateString();
      renderQR(STUDENT.id);
    }

    function qrUrl(data, size=260){
      return `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(data)}&choe=UTF-8`;
    }

    function renderQR(id){
      const box = document.querySelector('#qrBox');
      box.innerHTML = '';
      const img = document.createElement('img');
      img.src = qrUrl(location.origin + location.pathname + '?id=' + id, 170);
      box.appendChild(img);
      const dl = document.querySelector('#downloadQR');
      dl.href = qrUrl(location.origin + location.pathname + '?id=' + id, 400);
      dl.download = `${id}-qr.png`;
    }

    function renderResults(){
      const tbody = document.querySelector('#resultsTableBody');
      tbody.innerHTML = STUDENT.results.map(r=>{
        const totalWork = r.study + r.oral + r.homework;
        const workStatus = totalWork>=50?'ناجح':'راسب';
        const finalScore = totalWork + r.exam;
        const finalStatus = finalScore>=60?'ناجح':'راسب';
        return `<tr>
          <td>${r.subject}</td>
          <td>${r.study}</td>
          <td>${r.oral}</td>
          <td>${r.homework}</td>
          <td>${totalWork}</td>
          <td>${workStatus}</td>
          <td>${r.exam}</td>
          <td>${finalScore}</td>
          <td>${finalStatus}</td>
        </tr>`;
      }).join('');
    }

    function renderNotes(){
      const list = document.querySelector('#notesList');
      if(!STUDENT.notes.length){
        list.innerHTML = `<div class="card-panel p-3 text-center"><div class="small-muted">لا توجد ملاحظات حالياً</div></div>`;
        return;
      }
      list.innerHTML = STUDENT.notes.map(n=>`
        <div class="note-card">
          <div class="d-flex justify-content-between">
            <div>
              <p class="mb-1">${n.text}</p>
              <small class="text-muted">${n.date}</small>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderExams(){
      const wrap = document.querySelector('#examsList');
      if(!STUDENT.exams.length){
        wrap.innerHTML = `<div class="card-panel p-3 text-center"><div class="small-muted">لا توجد نماذج منشورة</div></div>`;
        return;
      }
      wrap.innerHTML = STUDENT.exams.map(e=>`
        <div class="exam-card d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">${e.title}</h6>
            <small class="text-muted">تاريخ: ${e.date}</small>
          </div>
          <div class="text-end">
            <a class="btn btn-sm btn-outline-primary me-2" href="${e.file}" download>تحميل</a>
          </div>
        </div>
      `).join('');
    }

    function setupEvents(){
      document.querySelector('#showQRBtn').addEventListener('click', ()=>{
        const body = document.querySelector('#qrModalBody');
        body.innerHTML = `<img src="${qrUrl(location.origin + location.pathname + '?id=' + STUDENT.id,380)}" style="max-width:100%"><p class="small-muted mt-2">${location.href}</p>`;
        const modal = new bootstrap.Modal(document.querySelector('#qrModal'));
        modal.show();
      });

      document.querySelector('#btnAddNoteToggle').addEventListener('click', ()=>{
        document.querySelector('#addNoteArea').classList.toggle('hidden');
      });

      document.querySelector('#noteForm').addEventListener('submit', function(e){
        e.preventDefault();
        const text = document.querySelector('#noteText').value.trim();
        const date = document.querySelector('#noteDate').value || new Date().toLocaleDateString();
        if(!text){ alert('أدخل نص الملاحظة'); return; }
        STUDENT.notes.unshift({ text, date });
        document.querySelector('#noteText').value='';
        document.querySelector('#noteDate').value='';
        document.querySelector('#addNoteArea').classList.add('hidden');
        renderNotes();
      });

      document.querySelector('#btnRefreshResults').addEventListener('click', ()=>{
        renderResults();
        alert('تم تحديث النتائج');
      });
    }

    (function init(){
      renderProfile();
      renderResults();
      renderNotes();
      renderExams();
      setupEvents();
    })();
    //end cha





