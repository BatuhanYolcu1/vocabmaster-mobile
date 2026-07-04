import AsyncStorage from '@react-native-async-storage/async-storage';

export type StudyWord = {
  id: string;
  word: string;
  tr: string;
  def: string;
  example: string;
  exampleTr: string;
  type: string;
  _listId?: string;
};

export type DefaultList = {
  id: string;
  name: string;
  color: string;
  bg: string;
  symbol: string;
  words: StudyWord[];
};

export const DEFAULT_LISTS: DefaultList[] = [
  {
    id: '1', name: 'B1 Temel Kelimeler', color: '#5B4CF5', bg: '#EEF2FF', symbol: 'book.fill',
    words: [
      { id: '1',  word: 'Eloquent',      tr: 'Belagatlı',         def: 'Güzel ve etkili konuşma yeteneğine sahip',   example: 'She gave an eloquent speech.',               exampleTr: 'Belagatlı bir konuşma yaptı.',                   type: 'adjective' },
      { id: '2',  word: 'Serendipity',   tr: 'Güzel tesadüf',     def: 'Şans eseri yapılan güzel bir keşif',         example: 'Finding that book was pure serendipity.',    exampleTr: 'O kitabı bulmak saf bir tesadüftü.',             type: 'noun'      },
      { id: '3',  word: 'Resilient',     tr: 'Dayanıklı',         def: 'Zorluklardan çabuk toparlanabilen',          example: 'Children are remarkably resilient.',         exampleTr: 'Çocuklar inanılmaz derecede dayanıklıdır.',      type: 'adjective' },
      { id: '4',  word: 'Ephemeral',     tr: 'Geçici',            def: 'Çok kısa süren, kalıcı olmayan',            example: 'Fame can be ephemeral.',                     exampleTr: 'Şöhret geçici olabilir.',                        type: 'adjective' },
      { id: '5',  word: 'Meticulous',    tr: 'Titiz',             def: 'Her detaya özen gösteren',                  example: 'She is meticulous in her work.',             exampleTr: 'İşinde çok titizdir.',                           type: 'adjective' },
      { id: '6',  word: 'Ambiguous',     tr: 'Belirsiz',          def: 'Birden fazla anlama gelebilen',             example: 'The instructions were ambiguous.',           exampleTr: 'Talimatlar belirsizdi.',                          type: 'adjective' },
      { id: '7',  word: 'Diligent',      tr: 'Çalışkan',          def: 'İşine özen ve gayret gösteren',             example: 'He is a diligent student.',                 exampleTr: 'Çalışkan bir öğrencidir.',                       type: 'adjective' },
      { id: '8',  word: 'Tenacious',     tr: 'Azimli',            def: 'Hedefinden vazgeçmeyen, ısrarcı',           example: 'She is tenacious in her goals.',             exampleTr: 'Hedeflerinde azimlidir.',                        type: 'adjective' },
      { id: '9',  word: 'Benevolent',    tr: 'Hayırsever',        def: 'İyilik yapmaktan hoşlanan',                 example: 'A benevolent donation changed lives.',       exampleTr: 'Hayırsever bir bağış hayatları değiştirdi.',     type: 'adjective' },
      { id: '10', word: 'Candid',        tr: 'Açık sözlü',        def: 'Dürüst ve içten davranan',                  example: 'Please be candid with me.',                 exampleTr: 'Lütfen benimle açık sözlü ol.',                  type: 'adjective' },
      { id: '11', word: 'Grateful',      tr: 'Minnettar',         def: 'Yapılan iyilikten dolayı şükran duyan',     example: 'I am grateful for your help.',               exampleTr: 'Yardımın için minnettarım.',                     type: 'adjective' },
      { id: '12', word: 'Confident',     tr: 'Kendinden emin',    def: 'Kendi yeteneklerine güvenen',               example: 'She spoke in a confident voice.',            exampleTr: 'Kendinden emin bir sesle konuştu.',              type: 'adjective' },
      { id: '13', word: 'Patient',       tr: 'Sabırlı',           def: 'Bekleyebilen, acele etmeyen',               example: 'Be patient, the results take time.',        exampleTr: 'Sabırlı ol, sonuçlar zaman alır.',               type: 'adjective' },
      { id: '14', word: 'Ambitious',     tr: 'Hırslı',            def: 'Büyük hedefler peşinde koşan',              example: 'She is ambitious about her career.',        exampleTr: 'Kariyeri konusunda hırslıdır.',                  type: 'adjective' },
      { id: '15', word: 'Flexible',      tr: 'Esnek',             def: 'Değişen koşullara kolayca uyum sağlayan',   example: 'We need a flexible schedule.',              exampleTr: 'Esnek bir programa ihtiyacımız var.',            type: 'adjective' },
      { id: '16', word: 'Reliable',      tr: 'Güvenilir',         def: 'Her zaman güvenilir olan',                  example: 'She is a reliable colleague.',              exampleTr: 'Güvenilir bir meslektaştır.',                    type: 'adjective' },
      { id: '17', word: 'Generous',      tr: 'Cömert',            def: 'Başkalarına bol bol veren',                 example: 'He is generous with his time.',             exampleTr: 'Zamanı konusunda cömerttir.',                    type: 'adjective' },
      { id: '18', word: 'Humble',        tr: 'Alçakgönüllü',      def: 'Kendini üstün görmeyen, mütevazı',          example: 'Despite her success, she stayed humble.',   exampleTr: 'Başarısına rağmen alçakgönüllü kaldı.',          type: 'adjective' },
      { id: '19', word: 'Optimistic',    tr: 'İyimser',           def: 'Her şeyin iyi gideceğine inanan',           example: 'Stay optimistic about the future.',         exampleTr: 'Gelecek konusunda iyimser ol.',                  type: 'adjective' },
      { id: '20', word: 'Enthusiastic',  tr: 'Hevesli',           def: 'Büyük istekle ve enerjiyle katılan',        example: 'The team was enthusiastic about the idea.', exampleTr: 'Ekip fikir konusunda hevesliydi.',               type: 'adjective' },
      { id: '21', word: 'Courageous',    tr: 'Cesur',             def: 'Tehlikeye rağmen harekete geçen',           example: 'It was a courageous decision.',             exampleTr: 'Cesur bir karardı.',                             type: 'adjective' },
      { id: '22', word: 'Sincere',       tr: 'Samimi',            def: 'Gerçek duygu ve düşüncelerini ifade eden',  example: 'He gave a sincere apology.',                exampleTr: 'Samimi bir özür diledi.',                        type: 'adjective' },
      { id: '23', word: 'Persistent',    tr: 'Kararlı',           def: 'Engellere rağmen devam eden',               example: 'Be persistent and you will succeed.',       exampleTr: 'Kararlı ol ve başaracaksın.',                    type: 'adjective' },
      { id: '24', word: 'Witty',         tr: 'Nükteli',           def: 'Zekice ve esprili bir şekilde konuşan',     example: 'She made a witty remark.',                  exampleTr: 'Nükteli bir yorum yaptı.',                       type: 'adjective' },
      { id: '25', word: 'Stubborn',      tr: 'İnatçı',            def: 'Fikrini değiştirmeye direnen',              example: 'He is too stubborn to apologize.',          exampleTr: 'Özür dilemek için çok inatçı.',                  type: 'adjective' },
      { id: '26', word: 'Accomplish',    tr: 'Başarmak',          def: 'Bir hedefe ulaşmak veya tamamlamak',        example: 'She accomplished all her goals.',           exampleTr: 'Tüm hedeflerini başardı.',                       type: 'verb'      },
      { id: '27', word: 'Overcome',      tr: 'Üstesinden gelmek', def: 'Bir engeli veya zorluğu aşmak',             example: 'She overcame many obstacles.',              exampleTr: 'Birçok engeli aştı.',                            type: 'verb'      },
      { id: '28', word: 'Achieve',       tr: 'Elde etmek',        def: 'Çaba ile bir sonuca ulaşmak',               example: 'Hard work helps you achieve your dreams.',  exampleTr: 'Çalışmak hayallerine ulaşmanı sağlar.',          type: 'verb'      },
      { id: '29', word: 'Admire',        tr: 'Hayran olmak',      def: 'Birini ya da bir şeyi takdir etmek',        example: 'I admire her dedication.',                  exampleTr: 'Onun kararlılığına hayranım.',                   type: 'verb'      },
      { id: '30', word: 'Contribute',    tr: 'Katkıda bulunmak',  def: 'Bir şeye pay ya da fayda sağlamak',         example: 'Everyone should contribute to the team.',   exampleTr: 'Herkes takıma katkıda bulunmalı.',               type: 'verb'      },
      { id: '31', word: 'Communicate',   tr: 'İletişim kurmak',   def: 'Bilgi veya duygu aktarmak',                 example: 'It is important to communicate clearly.',   exampleTr: 'Açıkça iletişim kurmak önemlidir.',             type: 'verb'      },
      { id: '32', word: 'Consider',      tr: 'Göz önünde bulundurmak', def: 'Dikkatlice düşünmek, değerlendirmek', example: 'Consider all options before deciding.',      exampleTr: 'Karar vermeden önce tüm seçenekleri değerlendir.', type: 'verb' },
      { id: '33', word: 'Avoid',         tr: 'Kaçınmak',          def: 'Bir şeyden uzak durmak',                    example: 'Avoid making the same mistake twice.',      exampleTr: 'Aynı hatayı iki kez yapmaktan kaçın.',          type: 'verb'      },
      { id: '34', word: 'Encourage',     tr: 'Teşvik etmek',      def: 'Birini desteklemek ve cesaretlendirmek',    example: 'Encourage your friends to keep going.',     exampleTr: 'Arkadaşlarını devam etmeye teşvik et.',          type: 'verb'      },
      { id: '35', word: 'Improve',       tr: 'Geliştirmek',       def: 'Daha iyi bir hale getirmek',                example: 'Practice helps you improve your skills.',   exampleTr: 'Pratik, becerilerini geliştirmene yardımcı olur.', type: 'verb'    },
      { id: '36', word: 'Achievement',   tr: 'Başarı',            def: 'Emek ve çabayla elde edilen sonuç',         example: 'Graduating was a great achievement.',       exampleTr: 'Mezuniyet büyük bir başarıydı.',                 type: 'noun'      },
      { id: '37', word: 'Challenge',     tr: 'Zorluk',            def: 'Üstesinden gelinmesi gereken engel',        example: 'Every challenge makes you stronger.',       exampleTr: 'Her zorluk seni daha güçlü kılar.',             type: 'noun'      },
      { id: '38', word: 'Consequence',   tr: 'Sonuç',             def: 'Bir eylemin doğurduğu etki',                example: 'Think about the consequences of your choice.', exampleTr: 'Seçiminin sonuçlarını düşün.',                type: 'noun'      },
      { id: '39', word: 'Effort',        tr: 'Çaba',              def: 'Bir şeyi gerçekleştirmek için harcanan güç', example: 'Success requires a lot of effort.',        exampleTr: 'Başarı çok çaba gerektirir.',                    type: 'noun'      },
      { id: '40', word: 'Knowledge',     tr: 'Bilgi',             def: 'Öğrenme ve deneyimle edinilen anlayış',     example: 'Knowledge is power.',                       exampleTr: 'Bilgi güçtür.',                                  type: 'noun'      },
      { id: '41', word: 'Opportunity',   tr: 'Fırsat',            def: 'Elverişli durum veya zaman',                example: 'Do not miss this opportunity.',             exampleTr: 'Bu fırsatı kaçırma.',                            type: 'noun'      },
      { id: '42', word: 'Relationship',  tr: 'İlişki',            def: 'İki kişi veya şey arasındaki bağ',          example: 'Build strong relationships at work.',       exampleTr: 'İşte güçlü ilişkiler kur.',                     type: 'noun'      },
      { id: '43', word: 'Solution',      tr: 'Çözüm',             def: 'Bir sorunu ortadan kaldıran yanıt',         example: 'We need a creative solution.',              exampleTr: 'Yaratıcı bir çözüme ihtiyacımız var.',           type: 'noun'      },
      { id: '44', word: 'Opinion',       tr: 'Görüş',             def: 'Bir konuda sahip olunan kişisel düşünce',   example: 'In my opinion, this is the best option.',   exampleTr: 'Benim görüşüme göre bu en iyi seçenek.',        type: 'noun'      },
      { id: '45', word: 'Responsibility', tr: 'Sorumluluk',       def: 'Bir şeyi yapmak ya da sahip çıkmak yükümlülüğü', example: 'Take responsibility for your actions.', exampleTr: 'Eylemlerinizin sorumluluğunu alın.',            type: 'noun'      },
      { id: '46', word: 'Behavior',      tr: 'Davranış',          def: 'Bir kişinin hareket etme biçimi',           example: 'His behavior surprised everyone.',          exampleTr: 'Davranışı herkesi şaşırttı.',                    type: 'noun'      },
      { id: '47', word: 'Experience',    tr: 'Deneyim',           def: 'Pratik olaylardan elde edilen bilgi',       example: 'Experience is the best teacher.',           exampleTr: 'Deneyim en iyi öğretmendir.',                    type: 'noun'      },
      { id: '48', word: 'Curiosity',     tr: 'Merak',             def: 'Bir şeyi öğrenmek için duyulan istek',      example: 'Curiosity drives great discoveries.',       exampleTr: 'Merak büyük keşiflere yol açar.',               type: 'noun'      },
      { id: '49', word: 'Perspective',   tr: 'Bakış açısı',       def: 'Bir konuya yaklaşım biçimi',                example: 'Try to see it from her perspective.',       exampleTr: 'Onu onun bakış açısından görmeye çalış.',        type: 'noun'      },
      { id: '50', word: 'Determine',     tr: 'Belirlemek',        def: 'Kesin karar vermek veya saptamak',          example: 'We need to determine the cause.',           exampleTr: 'Nedeni belirlememiz gerekiyor.',                 type: 'verb'      },
    ],
  },
  {
    id: '2', name: 'İş İngilizcesi', color: '#22C55E', bg: '#F0FDF4', symbol: 'briefcase.fill',
    words: [
      { id: '1',  word: 'Leverage',        tr: 'Avantajdan yararlanmak', def: 'Bir avantajı en iyi şekilde kullanmak',          example: 'We can leverage our network to grow.',       exampleTr: 'Büyümek için ağımızdan yararlanabiliriz.',         type: 'verb'      },
      { id: '2',  word: 'Streamline',      tr: 'Sadeleştirmek',          def: 'Süreci daha verimli hale getirmek',              example: 'We need to streamline our process.',         exampleTr: 'Sürecimizi sadeleştirmeliyiz.',                    type: 'verb'      },
      { id: '3',  word: 'Synergy',         tr: 'Sinerji',                def: 'Birlikte çalışarak daha güçlü sonuç almak',      example: 'There is great synergy in this team.',       exampleTr: 'Bu ekipte büyük sinerji var.',                     type: 'noun'      },
      { id: '4',  word: 'Delegate',        tr: 'Yetki devretmek',        def: 'Görevi başka birine aktarmak',                   example: 'A good manager knows how to delegate.',      exampleTr: 'İyi yönetici nasıl yetki devredeceğini bilir.',    type: 'verb'      },
      { id: '5',  word: 'Milestone',       tr: 'Kilometre taşı',         def: 'Projedeki önemli başarı noktası',                example: 'We reached a major milestone today.',        exampleTr: 'Bugün büyük bir kilometre taşına ulaştık.',        type: 'noun'      },
      { id: '6',  word: 'Deadline',        tr: 'Son teslim tarihi',      def: 'Bir işin tamamlanması gereken tarih',            example: 'The deadline is next Friday.',               exampleTr: 'Son teslim tarihi gelecek Cuma.',                  type: 'noun'      },
      { id: '7',  word: 'Feedback',        tr: 'Geri bildirim',          def: 'Performans veya ürün hakkında yorum',            example: 'Please give me honest feedback.',            exampleTr: 'Lütfen dürüst geri bildirim ver.',                 type: 'noun'      },
      { id: '8',  word: 'Agenda',          tr: 'Gündem',                 def: 'Toplantıda ele alınacak konular listesi',        example: 'What is on today\'s agenda?',                exampleTr: 'Bugünün gündeminde ne var?',                       type: 'noun'      },
      { id: '9',  word: 'Budget',          tr: 'Bütçe',                  def: 'Belirli bir amaç için ayrılan para miktarı',     example: 'We need to stay within budget.',             exampleTr: 'Bütçe dahilinde kalmamız gerekiyor.',              type: 'noun'      },
      { id: '10', word: 'Proposal',        tr: 'Teklif',                 def: 'Bir fikri ya da planı sunma belgesi',            example: 'Submit your proposal by Monday.',            exampleTr: 'Teklifini pazartesiye kadar sun.',                 type: 'noun'      },
      { id: '11', word: 'Negotiate',       tr: 'Müzakere etmek',         def: 'Anlaşmaya varmak için görüşmek',                example: 'We need to negotiate the terms.',            exampleTr: 'Şartları müzakere etmemiz gerekiyor.',             type: 'verb'      },
      { id: '12', word: 'Implement',       tr: 'Uygulamak',              def: 'Bir planı hayata geçirmek',                     example: 'Implement the new policy from next week.',   exampleTr: 'Yeni politikayı gelecek haftadan itibaren uygula.', type: 'verb'    },
      { id: '13', word: 'Priority',        tr: 'Öncelik',                def: 'En önemli veya acil olan şey',                  example: 'Customer satisfaction is our top priority.', exampleTr: 'Müşteri memnuniyeti en önceliğimiz.',              type: 'noun'      },
      { id: '14', word: 'Strategy',        tr: 'Strateji',               def: 'Hedefe ulaşmak için geliştirilen plan',         example: 'Our strategy is to expand globally.',        exampleTr: 'Stratejimiz küresel olarak genişlemek.',           type: 'noun'      },
      { id: '15', word: 'Revenue',         tr: 'Gelir',                  def: 'Satış veya hizmetle elde edilen para',          example: 'Revenue increased by 20% this year.',        exampleTr: 'Gelir bu yıl yüzde 20 arttı.',                    type: 'noun'      },
      { id: '16', word: 'Stakeholder',     tr: 'Paydaş',                 def: 'Projede çıkarı olan kişi veya kurum',           example: 'Keep all stakeholders informed.',            exampleTr: 'Tüm paydaşları bilgili tut.',                      type: 'noun'      },
      { id: '17', word: 'Collaborate',     tr: 'İşbirliği yapmak',       def: 'Ortak bir hedef için birlikte çalışmak',        example: 'We collaborate with global teams.',          exampleTr: 'Küresel ekiplerle işbirliği yapıyoruz.',           type: 'verb'      },
      { id: '18', word: 'Efficiency',      tr: 'Verimlilik',             def: 'Az kaynak ile çok iş yapabilme',                example: 'Improve the efficiency of the workflow.',    exampleTr: 'İş akışının verimliliğini artır.',                 type: 'noun'      },
      { id: '19', word: 'Initiative',      tr: 'İnisiyatif',             def: 'Başkasının talimatı olmadan harekete geçme',    example: 'Take the initiative and start the project.', exampleTr: 'İnisiyatif alıp projeyi başlat.',                 type: 'noun'      },
      { id: '20', word: 'Outsource',       tr: 'Dış kaynak kullanmak',   def: 'İşi dışarıdan bir firmaya yaptırmak',           example: 'They outsource their IT support.',           exampleTr: 'IT desteklerini dışarıdan sağlıyorlar.',           type: 'verb'      },
      { id: '21', word: 'Accountability',  tr: 'Hesap verebilirlik',     def: 'Eylemlerden sorumlu olmayı kabul etme',         example: 'Accountability is key to good leadership.',  exampleTr: 'Hesap verebilirlik iyi liderliğin temelidir.',    type: 'noun'      },
      { id: '22', word: 'Bottleneck',      tr: 'Darboğaz',               def: 'Bir süreci yavaşlatan nokta',                   example: 'Identify the bottleneck in production.',     exampleTr: 'Üretimdeki darboğazı tespit et.',                  type: 'noun'      },
      { id: '23', word: 'Scalable',        tr: 'Ölçeklenebilir',         def: 'Büyüdükçe de işlevini koruyabilen',             example: 'Build a scalable business model.',           exampleTr: 'Ölçeklenebilir bir iş modeli oluştur.',            type: 'adjective' },
      { id: '24', word: 'Benchmark',       tr: 'Referans ölçüt',         def: 'Karşılaştırma için kullanılan standart',        example: 'Set a benchmark for performance.',           exampleTr: 'Performans için referans ölçüt belirle.',          type: 'noun'      },
      { id: '25', word: 'Disruptive',      tr: 'Yıkıcı yenilikçi',      def: 'Mevcut düzeni kökten değiştiren',               example: 'A disruptive technology changed the market.', exampleTr: 'Yıkıcı bir teknoloji piyasayı değiştirdi.',       type: 'adjective' },
      { id: '26', word: 'Overhead',        tr: 'Genel giderler',         def: 'Üretimle doğrudan ilgili olmayan sabit giderler', example: 'We need to reduce overhead costs.',         exampleTr: 'Genel giderleri azaltmamız gerekiyor.',            type: 'noun'      },
      { id: '27', word: 'Profitability',   tr: 'Karlılık',               def: 'Gelirin giderleri geçme oranı',                 example: 'Profitability improved this quarter.',       exampleTr: 'Bu çeyrekte karlılık arttı.',                      type: 'noun'      },
      { id: '28', word: 'Quarterly',       tr: 'Üç aylık',               def: 'Her üç ayda bir gerçekleşen',                   example: 'We hold quarterly performance reviews.',     exampleTr: 'Üç ayda bir performans değerlendirmesi yapıyoruz.', type: 'adjective' },
      { id: '29', word: 'Forecast',        tr: 'Tahmin etmek',           def: 'Gelecekteki durumu öngörmek',                   example: 'We forecast strong growth next year.',       exampleTr: 'Önümüzdeki yıl güçlü büyüme tahmin ediyoruz.',    type: 'verb'      },
      { id: '30', word: 'Retain',          tr: 'Elde tutmak',            def: 'Mevcut müşteri veya çalışanı kaybetmemek',      example: 'It is important to retain talented employees.', exampleTr: 'Yetenekli çalışanları elde tutmak önemlidir.',  type: 'verb'      },
    ],
  },
  {
    id: '3', name: 'Akademik Kelimeler', color: '#A855F7', bg: '#F5F3FF', symbol: 'graduationcap.fill',
    words: [
      { id: '1',  word: 'Hypothesis',    tr: 'Hipotez',             def: 'Test edilmeyi bekleyen önerme',                    example: 'The hypothesis was confirmed by data.',      exampleTr: 'Hipotez verilerle doğrulandı.',                  type: 'noun'      },
      { id: '2',  word: 'Empirical',     tr: 'Ampirik',             def: 'Gözlem ve deneye dayalı',                          example: 'Empirical evidence is crucial in science.',  exampleTr: 'Ampirik kanıt bilimde çok önemlidir.',           type: 'adjective' },
      { id: '3',  word: 'Paradigm',      tr: 'Paradigma',           def: 'Düşünce veya araştırmada temel model',             example: 'A paradigm shift changed the field.',        exampleTr: 'Bir paradigma değişimi alanı dönüştürdü.',       type: 'noun'      },
      { id: '4',  word: 'Synthesis',     tr: 'Sentez',              def: 'Farklı unsurları bir araya getirme',               example: 'The essay is a synthesis of many ideas.',    exampleTr: 'Makale birçok fikrin sentezi.',                   type: 'noun'      },
      { id: '5',  word: 'Methodology',   tr: 'Metodoloji',          def: 'Araştırmada kullanılan yöntemler bütünü',          example: 'Explain your research methodology.',         exampleTr: 'Araştırma metodolojinizi açıklayın.',            type: 'noun'      },
      { id: '6',  word: 'Theory',        tr: 'Teori',               def: 'Olguları açıklamak için geliştirilen model',       example: 'Darwin\'s theory changed biology.',          exampleTr: 'Darwin\'in teorisi biyolojiyi değiştirdi.',      type: 'noun'      },
      { id: '7',  word: 'Analysis',      tr: 'Analiz',              def: 'Bir konuyu ayrıntılı inceleme',                    example: 'A detailed analysis is needed.',             exampleTr: 'Ayrıntılı bir analiz gerekiyor.',                type: 'noun'      },
      { id: '8',  word: 'Abstract',      tr: 'Özet',                def: 'Makalenin kısa içerik özeti',                      example: 'Read the abstract before the full paper.',   exampleTr: 'Tam makaleden önce özeti okuyun.',               type: 'noun'      },
      { id: '9',  word: 'Citation',      tr: 'Atıf',                def: 'Başkasının çalışmasına yapılan kaynak gösterme',   example: 'Include proper citations in your essay.',    exampleTr: 'Makalenize uygun atıflar ekleyin.',              type: 'noun'      },
      { id: '10', word: 'Evidence',      tr: 'Kanıt',               def: 'Bir iddiayı destekleyen bilgi veya bulgu',         example: 'Provide evidence to support your claim.',    exampleTr: 'İddiayı desteklemek için kanıt sun.',            type: 'noun'      },
      { id: '11', word: 'Inference',     tr: 'Çıkarım',             def: 'Mevcut bilgiden mantıkla varılan sonuç',           example: 'Draw an inference from the data.',           exampleTr: 'Verilerden bir çıkarım yap.',                     type: 'noun'      },
      { id: '12', word: 'Phenomenon',    tr: 'Fenomen',             def: 'Gözlemlenebilen olay veya olgu',                   example: 'Climate change is a global phenomenon.',     exampleTr: 'İklim değişikliği küresel bir fenomendir.',      type: 'noun'      },
      { id: '13', word: 'Coherence',     tr: 'Tutarlılık',          def: 'Fikirlerin mantıklı bir şekilde birbirine bağlı olması', example: 'The essay lacks coherence.',            exampleTr: 'Makale tutarlılıktan yoksun.',                    type: 'noun'      },
      { id: '14', word: 'Consensus',     tr: 'Fikir birliği',       def: 'Bir grup içinde genel görüş birliği',              example: 'There is a scientific consensus on this.',   exampleTr: 'Bu konuda bilimsel fikir birliği var.',          type: 'noun'      },
      { id: '15', word: 'Correlation',   tr: 'Korelasyon',          def: 'İki değişken arasındaki ilişki',                   example: 'There is a correlation between the two.',    exampleTr: 'İkisi arasında bir korelasyon var.',             type: 'noun'      },
      { id: '16', word: 'Framework',     tr: 'Çerçeve',             def: 'Bir konuyu anlamak için kullanılan yapı',          example: 'Use a theoretical framework for your study.', exampleTr: 'Çalışmanız için teorik bir çerçeve kullanın.',  type: 'noun'      },
      { id: '17', word: 'Insight',       tr: 'İçgörü',              def: 'Bir konuyu derinlemesine anlama',                  example: 'This study provides valuable insights.',     exampleTr: 'Bu çalışma değerli içgörüler sunuyor.',          type: 'noun'      },
      { id: '18', word: 'Interpretation', tr: 'Yorum',              def: 'Bir bulgu veya metni açıklama biçimi',             example: 'Your interpretation of the data is unique.',  exampleTr: 'Verilerin yorumunuz benzersiz.',                 type: 'noun'      },
      { id: '19', word: 'Objective',     tr: 'Nesnel',              def: 'Kişisel duygu veya önyargıdan bağımsız',          example: 'Try to remain objective in your analysis.',  exampleTr: 'Analizinizde nesnel kalmaya çalışın.',           type: 'adjective' },
      { id: '20', word: 'Quantitative',  tr: 'Niceliksel',          def: 'Sayısal veriye dayalı',                            example: 'Quantitative research uses numbers.',        exampleTr: 'Niceliksel araştırma sayısal veri kullanır.',    type: 'adjective' },
      { id: '21', word: 'Qualitative',   tr: 'Niteliksel',          def: 'Sayısal olmayan, gözleme dayalı',                  example: 'Qualitative research uses interviews.',      exampleTr: 'Niteliksel araştırma görüşme kullanır.',         type: 'adjective' },
      { id: '22', word: 'Rationale',     tr: 'Gerekçe',             def: 'Bir karar veya eylemin arkasındaki neden',         example: 'Explain the rationale behind your choice.',  exampleTr: 'Seçiminizin gerekçesini açıklayın.',             type: 'noun'      },
      { id: '23', word: 'Significant',   tr: 'Anlamlı',             def: 'Önemli veya dikkat çekici düzeyde',               example: 'The results are statistically significant.', exampleTr: 'Sonuçlar istatistiksel olarak anlamlıdır.',      type: 'adjective' },
      { id: '24', word: 'Variable',      tr: 'Değişken',            def: 'Araştırmada ölçülen ve değişebilen unsur',        example: 'Control the variables in your experiment.',  exampleTr: 'Deneydeki değişkenleri kontrol edin.',           type: 'noun'      },
      { id: '25', word: 'Evaluate',      tr: 'Değerlendirmek',      def: 'Bir şeyin kalite veya değerini ölçmek',           example: 'Evaluate the sources critically.',           exampleTr: 'Kaynakları eleştirel gözle değerlendirin.',      type: 'verb'      },
      { id: '26', word: 'Conclude',      tr: 'Sonuçlandırmak',      def: 'Araştırma sonunda bir yargıya varmak',            example: 'We conclude that the method works.',         exampleTr: 'Yöntemin işe yaradığı sonucuna varıyoruz.',      type: 'verb'      },
      { id: '27', word: 'Derive',        tr: 'Türetmek',            def: 'Bir kaynaktan elde etmek veya çıkarmak',          example: 'Derive a formula from the data.',            exampleTr: 'Veriden bir formül türetin.',                     type: 'verb'      },
      { id: '28', word: 'Distinguish',   tr: 'Ayırt etmek',         def: 'İki şey arasındaki farkı ortaya koymak',          example: 'Distinguish between facts and opinions.',    exampleTr: 'Gerçekler ile görüşler arasında ayırt edin.',    type: 'verb'      },
      { id: '29', word: 'Formulate',     tr: 'Formüle etmek',       def: 'Sistematik bir şekilde ifade etmek',              example: 'Formulate a clear research question.',       exampleTr: 'Net bir araştırma sorusu formüle edin.',         type: 'verb'      },
      { id: '30', word: 'Investigate',   tr: 'Araştırmak',          def: 'Bir konuyu sistematik şekilde incelemek',         example: 'Investigate the causes of the problem.',     exampleTr: 'Sorunun nedenlerini araştırın.',                 type: 'verb'      },
      { id: '31', word: 'Justify',       tr: 'Gerekçelendirmek',    def: 'Bir kararın neden doğru olduğunu göstermek',      example: 'Justify your research choices.',             exampleTr: 'Araştırma tercihlerinizi gerekçelendirin.',      type: 'verb'      },
      { id: '32', word: 'Summarize',     tr: 'Özetlemek',           def: 'Ana noktaları kısaca aktarmak',                   example: 'Summarize the key findings.',                exampleTr: 'Temel bulgularını özetleyin.',                    type: 'verb'      },
      { id: '33', word: 'Verify',        tr: 'Doğrulamak',          def: 'Bir bilginin doğruluğunu kontrol etmek',          example: 'Verify your results with another method.',   exampleTr: 'Sonuçlarınızı başka yöntemle doğrulayın.',       type: 'verb'      },
      { id: '34', word: 'Ambiguity',     tr: 'Belirsizlik',         def: 'Birden fazla anlam taşıma durumu',                example: 'Remove ambiguity from your writing.',        exampleTr: 'Yazınızdaki belirsizlikleri giderin.',           type: 'noun'      },
      { id: '35', word: 'Critique',      tr: 'Eleştiri',            def: 'Bir çalışmanın güçlü ve zayıf yönlerini inceleme', example: 'Write a critique of the article.',          exampleTr: 'Makalenin eleştirisini yazın.',                  type: 'noun'      },
      { id: '36', word: 'Curriculum',    tr: 'Müfredat',            def: 'Bir programda okutulan dersler ve içerikler',     example: 'The curriculum was updated this year.',      exampleTr: 'Müfredat bu yıl güncellendi.',                    type: 'noun'      },
      { id: '37', word: 'Dissertation',  tr: 'Tez',                 def: 'Akademik derece için yazılan uzun araştırma',     example: 'She is writing her doctoral dissertation.',  exampleTr: 'Doktora tezini yazıyor.',                        type: 'noun'      },
      { id: '38', word: 'Relevant',      tr: 'İlgili',              def: 'Konuyla doğrudan bağlantılı olan',                example: 'Only include relevant information.',         exampleTr: 'Yalnızca ilgili bilgileri ekleyin.',             type: 'adjective' },
      { id: '39', word: 'Theoretical',   tr: 'Kuramsal',            def: 'Teoriye dayanan, pratikten bağımsız',             example: 'A theoretical approach was used.',           exampleTr: 'Kuramsal bir yaklaşım kullanıldı.',              type: 'adjective' },
      { id: '40', word: 'Peer review',   tr: 'Hakemli değerlendirme', def: 'Uzmanların bir çalışmayı değerlendirmesi',     example: 'The article passed peer review.',            exampleTr: 'Makale hakemli değerlendirmeden geçti.',         type: 'noun'      },
      { id: '41', word: 'Deduce',        tr: 'Sonuç çıkarmak',      def: 'Genel bilgiden özel sonuca ulaşmak',              example: 'What can we deduce from this experiment?',   exampleTr: 'Bu deneyden ne sonuç çıkarabiliriz?',            type: 'verb'      },
      { id: '42', word: 'Illustrate',    tr: 'Örneklemek',          def: 'Örnek vererek açıklamak',                         example: 'Use a diagram to illustrate your point.',    exampleTr: 'Noktanızı açıklamak için diyagram kullanın.',    type: 'verb'      },
      { id: '43', word: 'Literature',    tr: 'Literatür',           def: 'Bir alandaki yayımlanmış çalışmalar bütünü',      example: 'Review the existing literature first.',      exampleTr: 'Önce mevcut literatürü inceleyin.',              type: 'noun'      },
      { id: '44', word: 'Bias',          tr: 'Önyargı',             def: 'Nesnel olmayan, taraflı bir eğilim',              example: 'Avoid confirmation bias in research.',       exampleTr: 'Araştırmada doğrulama önyargısından kaçının.',   type: 'noun'      },
      { id: '45', word: 'Context',       tr: 'Bağlam',              def: 'Bir şeyi anlamayı sağlayan koşul veya ortam',     example: 'Consider the historical context.',           exampleTr: 'Tarihsel bağlamı göz önünde bulundurun.',        type: 'noun'      },
    ],
  },
  {
    id: '4', name: 'Seyahat', color: '#F97316', bg: '#FFF7ED', symbol: 'airplane',
    words: [
      { id: '1',  word: 'Itinerary',      tr: 'Seyahat planı',     def: 'Gezi için hazırlanmış detaylı program',           example: 'Check the itinerary for tomorrow.',          exampleTr: 'Yarın için seyahat planını kontrol et.',         type: 'noun' },
      { id: '2',  word: 'Accommodation',  tr: 'Konaklama',         def: 'Seyahatte kalınacak yer',                         example: 'Book your accommodation early.',             exampleTr: 'Konaklamayı erken ayırın.',                      type: 'noun' },
      { id: '3',  word: 'Departure',      tr: 'Kalkış',            def: 'Bir yerden ayrılma zamanı',                       example: 'Check the departure time.',                  exampleTr: 'Kalkış saatini kontrol et.',                     type: 'noun' },
      { id: '4',  word: 'Arrival',        tr: 'Varış',             def: 'Bir yere ulaşma zamanı',                          example: 'The arrival is at 10 PM.',                   exampleTr: 'Varış saat 22:00\'de.',                          type: 'noun' },
      { id: '5',  word: 'Boarding pass',  tr: 'Biniş kartı',       def: 'Uçağa binmek için gerekli kart',                  example: 'Show your boarding pass at the gate.',       exampleTr: 'Kapıda biniş kartını göster.',                   type: 'noun' },
      { id: '6',  word: 'Customs',        tr: 'Gümrük',            def: 'Sınırda gerçekleştirilen eşya kontrolü',          example: 'Declare your items at customs.',             exampleTr: 'Eşyalarını gümrükte beyan et.',                  type: 'noun' },
      { id: '7',  word: 'Destination',    tr: 'Varış noktası',     def: 'Gidilmek istenen yer',                            example: 'Paris is our final destination.',            exampleTr: 'Paris son varış noktamız.',                      type: 'noun' },
      { id: '8',  word: 'Layover',        tr: 'Aktarma',           def: 'Aktarma yapılan bekleme süresi',                  example: 'We have a 3-hour layover in Istanbul.',      exampleTr: 'İstanbul\'da 3 saatlik aktarma var.',            type: 'noun' },
      { id: '9',  word: 'Passport',       tr: 'Pasaport',          def: 'Uluslararası seyahatte kullanılan kimlik belgesi', example: 'Don\'t forget your passport.',               exampleTr: 'Pasaportunuzu unutmayın.',                       type: 'noun' },
      { id: '10', word: 'Reservation',    tr: 'Rezervasyon',       def: 'Otel, uçak gibi hizmetler için ön kayıt',         example: 'I have a reservation at the hotel.',         exampleTr: 'Otelde rezervasyonum var.',                      type: 'noun' },
      { id: '11', word: 'Visa',           tr: 'Vize',              def: 'Yabancı ülkeye giriş izni',                       example: 'You need a visa to enter that country.',     exampleTr: 'O ülkeye girmek için vize gerekiyor.',           type: 'noun' },
      { id: '12', word: 'Baggage',        tr: 'Bagaj',             def: 'Yolculukta taşınan eşya',                         example: 'Your baggage limit is 23 kg.',               exampleTr: 'Bagaj limitin 23 kg.',                           type: 'noun' },
      { id: '13', word: 'Check-in',       tr: 'Check-in',          def: 'Otele veya uçuşa kayıt yaptırma',                 example: 'Check-in starts two hours before.',          exampleTr: 'Check-in iki saat önce başlıyor.',               type: 'noun' },
      { id: '14', word: 'Currency',       tr: 'Para birimi',       def: 'Bir ülkede kullanılan para',                      example: 'What is the local currency here?',           exampleTr: 'Buradaki yerel para birimi nedir?',              type: 'noun' },
      { id: '15', word: 'Delay',          tr: 'Gecikme',           def: 'Beklenen zamandan sonraya kalma',                 example: 'The flight has a two-hour delay.',           exampleTr: 'Uçuşun iki saatlik gecikmesi var.',              type: 'noun' },
      { id: '16', word: 'Exchange rate',  tr: 'Döviz kuru',        def: 'Bir para biriminin diğerine karşı değeri',        example: 'Check the exchange rate before you go.',     exampleTr: 'Gitmeden önce döviz kurunu kontrol et.',         type: 'noun' },
      { id: '17', word: 'Landmark',       tr: 'Simge yapı',        def: 'Bir şehirde kolayca tanınan önemli yer',          example: 'The Eiffel Tower is a famous landmark.',     exampleTr: 'Eyfel Kulesi ünlü bir simge yapıdır.',           type: 'noun' },
      { id: '18', word: 'Jet lag',        tr: 'Zaman dilimi yorgunluğu', def: 'Saat dilimi farkından kaynaklanan yorgunluk', example: 'I suffered from jet lag after the trip.',  exampleTr: 'Yolculuktan sonra zaman dilimi yorgunluğu çektim.', type: 'noun' },
      { id: '19', word: 'Souvenir',       tr: 'Hediyelik eşya',   def: 'Seyahatten getirilen hatıra eşyası',              example: 'I bought a souvenir for my family.',         exampleTr: 'Aileme hediyelik eşya aldım.',                   type: 'noun' },
      { id: '20', word: 'Local cuisine',  tr: 'Yerel mutfak',      def: 'Bir bölgeye özgü yemekler',                       example: 'Try the local cuisine when you travel.',     exampleTr: 'Seyahat ederken yerel mutfağı deneyin.',         type: 'noun' },
      { id: '21', word: 'Navigation',     tr: 'Navigasyon',        def: 'Doğru yolu bulma, yol tarifi',                    example: 'Use navigation to find your hotel.',         exampleTr: 'Oteli bulmak için navigasyon kullan.',           type: 'noun' },
      { id: '22', word: 'Hostel',         tr: 'Hostel',            def: 'Ucuz, paylaşımlı konaklama yeri',                 example: 'Budget travelers often stay at hostels.',    exampleTr: 'Bütçe gezginleri çoğunlukla hostelde kalır.',    type: 'noun' },
      { id: '23', word: 'Guidebook',      tr: 'Rehber kitap',      def: 'Bir yer hakkında bilgi veren gezi rehberi',       example: 'Buy a guidebook before your trip.',          exampleTr: 'Seyahatten önce rehber kitap al.',               type: 'noun' },
      { id: '24', word: 'Tourist',        tr: 'Turist',            def: 'Tatil veya gezi amacıyla seyahat eden kişi',      example: 'The city is full of tourists in summer.',    exampleTr: 'Şehir yazın turistlerle dolu.',                  type: 'noun' },
      { id: '25', word: 'Round trip',     tr: 'Gidiş-dönüş',      def: 'Hem gidiş hem dönüş yolculuğunu kapsayan',        example: 'I booked a round trip to London.',           exampleTr: 'Londra\'ya gidiş-dönüş bilet aldım.',            type: 'noun' },
    ],
  },
  {
    id: '5', name: 'YDS Kelimeleri', color: '#EF4444', bg: '#FEF2F2', symbol: 'checklist',
    words: [
      { id: '1',  word: 'Comprehensive', tr: 'Kapsamlı',          def: 'Her yönüyle eksiksiz olan',                       example: 'The report offers a comprehensive analysis.',       exampleTr: 'Rapor kapsamlı bir analiz sunuyor.',                  type: 'adjective' },
      { id: '2',  word: 'Assess',        tr: 'Değerlendirmek',    def: 'Bir şeyin değerini veya niteliğini ölçmek',       example: 'Teachers assess students regularly.',               exampleTr: 'Öğretmenler öğrencileri düzenli değerlendirir.',      type: 'verb' },
      { id: '3',  word: 'Notwithstanding', tr: 'Rağmen',          def: 'Bir engele veya duruma karşın',                   example: 'Notwithstanding the risks, they proceeded.',        exampleTr: 'Risklere rağmen devam ettiler.',                      type: 'adverb' },
      { id: '4',  word: 'Implication',   tr: 'Sonuç, ima',        def: 'Bir eylemin dolaylı sonucu veya iması',           example: 'The decision has serious implications.',            exampleTr: 'Kararın ciddi sonuçları var.',                        type: 'noun' },
      { id: '5',  word: 'Substantial',   tr: 'Önemli, büyük',     def: 'Miktar veya değer olarak büyük',                  example: 'They made substantial progress.',                   exampleTr: 'Önemli ilerleme kaydettiler.',                        type: 'adjective' },
      { id: '6',  word: 'Constrain',     tr: 'Kısıtlamak',        def: 'Bir şeyin serbestliğini sınırlamak',              example: 'Budget cuts constrain our options.',                exampleTr: 'Bütçe kesintileri seçeneklerimizi kısıtlıyor.',       type: 'verb' },
      { id: '7',  word: 'Prevalent',     tr: 'Yaygın',            def: 'Belirli bir yerde/zamanda sık görülen',           example: 'This view is prevalent among experts.',             exampleTr: 'Bu görüş uzmanlar arasında yaygın.',                  type: 'adjective' },
      { id: '8',  word: 'Deteriorate',   tr: 'Kötüleşmek',        def: 'Giderek daha kötü hale gelmek',                   example: 'His health began to deteriorate.',                  exampleTr: 'Sağlığı kötüleşmeye başladı.',                        type: 'verb' },
      { id: '9',  word: 'Attribute',     tr: 'Atfetmek',          def: 'Bir şeyin nedenini bir kaynağa bağlamak',         example: 'She attributes her success to hard work.',          exampleTr: 'Başarısını sıkı çalışmaya atfediyor.',                type: 'verb' },
      { id: '10', word: 'Consecutive',   tr: 'Ardışık',           def: 'Kesintisiz birbirini izleyen',                    example: 'It rained for five consecutive days.',              exampleTr: 'Beş gün ardışık yağmur yağdı.',                       type: 'adjective' },
      { id: '11', word: 'Undermine',     tr: 'Baltalamak',        def: 'Gizliden zayıflatmak',                            example: 'Rumors can undermine trust.',                       exampleTr: 'Söylentiler güveni baltalayabilir.',                  type: 'verb' },
      { id: '12', word: 'Profound',      tr: 'Derin',             def: 'Çok güçlü ve etkileyici',                         example: 'The book had a profound effect on me.',             exampleTr: 'Kitap üzerimde derin bir etki bıraktı.',              type: 'adjective' },
      { id: '13', word: 'Facilitate',    tr: 'Kolaylaştırmak',    def: 'Bir sürecin gerçekleşmesini kolay hale getirmek', example: 'Technology facilitates communication.',             exampleTr: 'Teknoloji iletişimi kolaylaştırır.',                  type: 'verb' },
      { id: '14', word: 'Adverse',       tr: 'Olumsuz',           def: 'Zarar verici veya elverişsiz',                    example: 'The drug has adverse side effects.',                exampleTr: 'İlacın olumsuz yan etkileri var.',                    type: 'adjective' },
      { id: '15', word: 'Compensate',    tr: 'Telafi etmek',      def: 'Bir kaybı dengelemek veya karşılamak',            example: 'Nothing can compensate for lost time.',             exampleTr: 'Hiçbir şey kaybedilen zamanı telafi edemez.',         type: 'verb' },
      { id: '16', word: 'Deliberately',  tr: 'Kasıtlı olarak',    def: 'Bilerek ve isteyerek',                            example: 'He deliberately ignored the warning.',              exampleTr: 'Uyarıyı kasıtlı olarak görmezden geldi.',             type: 'adverb' },
      { id: '17', word: 'Diminish',      tr: 'Azalmak',           def: 'Boyut veya önem olarak küçülmek',                 example: 'Interest in the topic has diminished.',             exampleTr: 'Konuya ilgi azaldı.',                                 type: 'verb' },
      { id: '18', word: 'Explicit',      tr: 'Açık, net',         def: 'Hiçbir belirsizliğe yer bırakmayan',              example: 'The instructions were explicit.',                   exampleTr: 'Talimatlar açıktı.',                                  type: 'adjective' },
      { id: '19', word: 'Hinder',        tr: 'Engellemek',        def: 'İlerlemeyi zorlaştırmak',                         example: 'Bad weather hindered the rescue.',                  exampleTr: 'Kötü hava kurtarmayı engelledi.',                     type: 'verb' },
      { id: '20', word: 'Inevitable',    tr: 'Kaçınılmaz',        def: 'Önlenmesi mümkün olmayan',                        example: 'Change is inevitable.',                             exampleTr: 'Değişim kaçınılmazdır.',                              type: 'adjective' },
      { id: '21', word: 'Justify',       tr: 'Haklı çıkarmak',    def: 'Bir şeyin doğruluğunu gerekçelendirmek',          example: 'The results justify our approach.',                 exampleTr: 'Sonuçlar yaklaşımımızı haklı çıkarıyor.',             type: 'verb' },
      { id: '22', word: 'Legitimate',    tr: 'Meşru',             def: 'Yasalara veya kurallara uygun',                   example: 'She has a legitimate claim.',                       exampleTr: 'Meşru bir talebi var.',                               type: 'adjective' },
      { id: '23', word: 'Mutual',        tr: 'Karşılıklı',        def: 'İki taraf için de geçerli olan',                  example: 'They share a mutual respect.',                      exampleTr: 'Karşılıklı saygıları var.',                           type: 'adjective' },
      { id: '24', word: 'Neglect',       tr: 'İhmal etmek',       def: 'Gereken ilgiyi göstermemek',                      example: 'Do not neglect your health.',                       exampleTr: 'Sağlığını ihmal etme.',                               type: 'verb' },
      { id: '25', word: 'Obstacle',      tr: 'Engel',             def: 'İlerlemeyi zorlaştıran şey',                      example: 'Fear is the biggest obstacle.',                     exampleTr: 'Korku en büyük engeldir.',                            type: 'noun' },
      { id: '26', word: 'Persuade',      tr: 'İkna etmek',        def: 'Birini bir şeye inandırmak',                      example: 'She persuaded him to stay.',                        exampleTr: 'Onu kalmaya ikna etti.',                              type: 'verb' },
      { id: '27', word: 'Reluctant',     tr: 'İsteksiz',          def: 'Bir şeyi yapmaya gönülsüz',                       example: 'He was reluctant to answer.',                       exampleTr: 'Cevap vermeye isteksizdi.',                           type: 'adjective' },
      { id: '28', word: 'Sustain',       tr: 'Sürdürmek',         def: 'Bir şeyi devam ettirmek',                         example: 'We must sustain economic growth.',                  exampleTr: 'Ekonomik büyümeyi sürdürmeliyiz.',                    type: 'verb' },
      { id: '29', word: 'Transition',    tr: 'Geçiş',             def: 'Bir durumdan diğerine geçme süreci',              example: 'The transition to democracy took years.',           exampleTr: 'Demokrasiye geçiş yıllar aldı.',                      type: 'noun' },
      { id: '30', word: 'Ultimately',    tr: 'Nihayetinde',       def: 'En sonunda, sonuç olarak',                        example: 'Ultimately, the choice is yours.',                  exampleTr: 'Nihayetinde seçim senin.',                            type: 'adverb' },
      { id: '31', word: 'Vulnerable',    tr: 'Savunmasız',        def: 'Kolayca zarar görebilen',                         example: 'Children are vulnerable to advertising.',           exampleTr: 'Çocuklar reklamlara karşı savunmasızdır.',            type: 'adjective' },
      { id: '32', word: 'Widespread',    tr: 'Yaygın',            def: 'Geniş bir alana yayılmış',                        example: 'The disease caused widespread panic.',              exampleTr: 'Hastalık yaygın paniğe yol açtı.',                    type: 'adjective' },
      { id: '33', word: 'Yield',         tr: 'Vermek, üretmek',   def: 'Sonuç veya ürün ortaya çıkarmak',                 example: 'The research yielded surprising results.',          exampleTr: 'Araştırma şaşırtıcı sonuçlar verdi.',                 type: 'verb' },
      { id: '34', word: 'Allocate',      tr: 'Tahsis etmek',      def: 'Belirli bir amaca kaynak ayırmak',                example: 'Funds were allocated for education.',               exampleTr: 'Eğitim için kaynak tahsis edildi.',                   type: 'verb' },
      { id: '35', word: 'Coincide',      tr: 'Denk gelmek',       def: 'Aynı zamanda gerçekleşmek',                       example: 'Her visit coincided with the festival.',            exampleTr: 'Ziyareti festivale denk geldi.',                      type: 'verb' },
      { id: '36', word: 'Density',       tr: 'Yoğunluk',          def: 'Birim alandaki miktar',                           example: 'The population density is high here.',              exampleTr: 'Burada nüfus yoğunluğu yüksek.',                      type: 'noun' },
      { id: '37', word: 'Emerge',        tr: 'Ortaya çıkmak',     def: 'Görünür veya bilinir hale gelmek',                example: 'New evidence emerged during the trial.',            exampleTr: 'Dava sırasında yeni kanıt ortaya çıktı.',             type: 'verb' },
      { id: '38', word: 'Fluctuate',     tr: 'Dalgalanmak',       def: 'Düzensiz biçimde artıp azalmak',                  example: 'Prices fluctuate with demand.',                     exampleTr: 'Fiyatlar taleple dalgalanır.',                        type: 'verb' },
      { id: '39', word: 'Incentive',     tr: 'Teşvik',            def: 'Bir davranışı özendiren şey',                     example: 'Tax cuts are an incentive to invest.',              exampleTr: 'Vergi indirimleri yatırım teşvikidir.',               type: 'noun' },
      { id: '40', word: 'Perceive',      tr: 'Algılamak',         def: 'Fark etmek, kavramak',                            example: 'People perceive risk differently.',                 exampleTr: 'İnsanlar riski farklı algılar.',                      type: 'verb' },
    ],
  },
  {
    id: '6', name: 'Phrasal Verbs', color: '#06B6D4', bg: '#ECFEFF', symbol: 'arrow.triangle.branch',
    words: [
      { id: '1',  word: 'Give up',      tr: 'Vazgeçmek',            def: 'Bir şeyi yapmayı bırakmak',                     example: 'Never give up on your dreams.',            exampleTr: 'Hayallerinden asla vazgeçme.',                       type: 'verb' },
      { id: '2',  word: 'Look after',   tr: 'İlgilenmek, bakmak',   def: 'Birinin veya bir şeyin bakımını üstlenmek',     example: 'She looks after her little brother.',      exampleTr: 'Küçük kardeşine bakıyor.',                           type: 'verb' },
      { id: '3',  word: 'Run into',     tr: 'Rastlamak',            def: 'Beklenmedik şekilde karşılaşmak',               example: 'I ran into an old friend today.',          exampleTr: 'Bugün eski bir arkadaşa rastladım.',                 type: 'verb' },
      { id: '4',  word: 'Put off',      tr: 'Ertelemek',            def: 'Bir işi sonraya bırakmak',                      example: 'Do not put off your homework.',            exampleTr: 'Ödevini erteleme.',                                  type: 'verb' },
      { id: '5',  word: 'Turn down',    tr: 'Reddetmek',            def: 'Bir teklifi kabul etmemek',                     example: 'She turned down the job offer.',           exampleTr: 'İş teklifini reddetti.',                             type: 'verb' },
      { id: '6',  word: 'Carry on',     tr: 'Devam etmek',          def: 'Bir şeyi sürdürmek',                            example: 'Carry on with your work.',                 exampleTr: 'İşine devam et.',                                    type: 'verb' },
      { id: '7',  word: 'Find out',     tr: 'Öğrenmek',             def: 'Bilgi edinmek, keşfetmek',                      example: 'I need to find out the truth.',            exampleTr: 'Gerçeği öğrenmem gerek.',                            type: 'verb' },
      { id: '8',  word: 'Get over',     tr: 'Atlatmak',             def: 'Bir zorluğu veya hastalığı aşmak',              example: 'It took months to get over the flu.',      exampleTr: 'Gribi atlatmak aylar sürdü.',                        type: 'verb' },
      { id: '9',  word: 'Set up',       tr: 'Kurmak',               def: 'Bir şeyi oluşturmak veya başlatmak',            example: 'They set up a new company.',               exampleTr: 'Yeni bir şirket kurdular.',                          type: 'verb' },
      { id: '10', word: 'Break down',   tr: 'Bozulmak',             def: 'Çalışmayı durdurmak, arızalanmak',              example: 'The car broke down on the highway.',       exampleTr: 'Araba otoyolda bozuldu.',                            type: 'verb' },
      { id: '11', word: 'Bring up',     tr: 'Gündeme getirmek',     def: 'Bir konuyu açmak; çocuk yetiştirmek',           example: 'She brought up an interesting point.',     exampleTr: 'İlginç bir noktayı gündeme getirdi.',                type: 'verb' },
      { id: '12', word: 'Call off',     tr: 'İptal etmek',          def: 'Planlanan bir şeyi iptal etmek',                example: 'The match was called off due to rain.',    exampleTr: 'Maç yağmur nedeniyle iptal edildi.',                 type: 'verb' },
      { id: '13', word: 'Come across',  tr: 'Denk gelmek',          def: 'Tesadüfen bulmak',                              example: 'I came across this book in a café.',       exampleTr: 'Bu kitaba bir kafede denk geldim.',                  type: 'verb' },
      { id: '14', word: 'Deal with',    tr: 'Başa çıkmak',          def: 'Bir sorunla ilgilenmek',                        example: 'She deals with customer complaints.',      exampleTr: 'Müşteri şikayetleriyle ilgileniyor.',                type: 'verb' },
      { id: '15', word: 'Figure out',   tr: 'Çözmek, anlamak',      def: 'Düşünerek bir çözüme ulaşmak',                  example: 'I cannot figure out this puzzle.',         exampleTr: 'Bu bulmacayı çözemiyorum.',                          type: 'verb' },
      { id: '16', word: 'Give in',      tr: 'Boyun eğmek',          def: 'Direnmeyi bırakıp kabul etmek',                 example: 'He finally gave in to pressure.',          exampleTr: 'Sonunda baskıya boyun eğdi.',                        type: 'verb' },
      { id: '17', word: 'Hold on',      tr: 'Beklemek',             def: 'Kısa süre beklemek',                            example: 'Hold on, I will check for you.',           exampleTr: 'Bekle, senin için kontrol edeyim.',                  type: 'verb' },
      { id: '18', word: 'Keep up',      tr: 'Ayak uydurmak',        def: 'Aynı hızda devam etmek',                        example: 'It is hard to keep up with technology.',   exampleTr: 'Teknolojiye ayak uydurmak zor.',                     type: 'verb' },
      { id: '19', word: 'Let down',     tr: 'Hayal kırıklığına uğratmak', def: 'Birinin beklentisini karşılamamak',       example: 'I will not let you down.',                 exampleTr: 'Seni hayal kırıklığına uğratmayacağım.',             type: 'verb' },
      { id: '20', word: 'Look forward to', tr: 'Dört gözle beklemek', def: 'Bir şeyi hevesle beklemek',                   example: 'I look forward to seeing you.',            exampleTr: 'Seni görmeyi dört gözle bekliyorum.',                type: 'verb' },
      { id: '21', word: 'Make up',      tr: 'Uydurmak; barışmak',   def: 'Hikaye uydurmak veya küslüğü bitirmek',         example: 'He made up an excuse.',                    exampleTr: 'Bir bahane uydurdu.',                                type: 'verb' },
      { id: '22', word: 'Pick up',      tr: 'Almak; öğrenmek',      def: 'Yerden almak; giderek öğrenmek',                example: 'She picked up Spanish quickly.',           exampleTr: 'İspanyolcayı hızla öğrendi.',                        type: 'verb' },
      { id: '23', word: 'Point out',    tr: 'Belirtmek',            def: 'Dikkat çekmek, işaret etmek',                   example: 'He pointed out a serious mistake.',        exampleTr: 'Ciddi bir hataya dikkat çekti.',                     type: 'verb' },
      { id: '24', word: 'Put up with',  tr: 'Katlanmak',            def: 'Hoş olmayan bir duruma tahammül etmek',         example: 'I cannot put up with this noise.',         exampleTr: 'Bu gürültüye katlanamıyorum.',                       type: 'verb' },
      { id: '25', word: 'Run out of',   tr: 'Tükenmek',             def: 'Bir şeyin stokunun bitmesi',                    example: 'We ran out of milk.',                      exampleTr: 'Sütümüz bitti.',                                     type: 'verb' },
      { id: '26', word: 'Take after',   tr: 'Çekmek, benzemek',     def: 'Aile büyüğüne benzemek',                        example: 'She takes after her mother.',              exampleTr: 'Annesine çekmiş.',                                   type: 'verb' },
      { id: '27', word: 'Take off',     tr: 'Havalanmak; çıkarmak', def: 'Uçağın kalkması; kıyafet çıkarmak',             example: 'The plane took off on time.',              exampleTr: 'Uçak zamanında havalandı.',                          type: 'verb' },
      { id: '28', word: 'Turn up',      tr: 'Çıkagelmek',           def: 'Beklenmedik şekilde ortaya çıkmak',             example: 'He turned up late to the meeting.',        exampleTr: 'Toplantıya geç çıkageldi.',                          type: 'verb' },
      { id: '29', word: 'Work out',     tr: 'Çözmek; egzersiz yapmak', def: 'Sonuca ulaştırmak; spor yapmak',             example: 'Everything worked out fine.',              exampleTr: 'Her şey yolunda gitti.',                             type: 'verb' },
      { id: '30', word: 'Look up',      tr: 'Aramak (sözlükte)',    def: 'Bilgiyi kaynaktan bulmak',                      example: 'Look up the word in a dictionary.',        exampleTr: 'Kelimeyi sözlükte ara.',                             type: 'verb' },
    ],
  },
  {
    id: '7', name: 'B2 Kelimeler', color: '#10B981', bg: '#ECFDF5', symbol: 'book.closed.fill',
    words: [
      { id: '1',  word: 'Elaborate',     tr: 'Ayrıntılı',        def: 'Çok detaylı ve özenli',                          example: 'They made elaborate plans.',                 exampleTr: 'Ayrıntılı planlar yaptılar.',                      type: 'adjective' },
      { id: '2',  word: 'Genuine',       tr: 'Gerçek, içten',    def: 'Sahte olmayan, samimi',                          example: 'Her surprise was genuine.',                  exampleTr: 'Şaşkınlığı gerçekti.',                             type: 'adjective' },
      { id: '3',  word: 'Deceive',       tr: 'Aldatmak',         def: 'Birini kandırmak',                               example: 'He deceived everyone with his lies.',        exampleTr: 'Yalanlarıyla herkesi aldattı.',                    type: 'verb' },
      { id: '4',  word: 'Anticipate',    tr: 'Öngörmek',         def: 'Bir şeyi önceden tahmin etmek',                  example: 'We anticipate strong demand.',               exampleTr: 'Güçlü bir talep öngörüyoruz.',                     type: 'verb' },
      { id: '5',  word: 'Bias',          tr: 'Önyargı',          def: 'Tarafsız olmayan eğilim',                        example: 'The article shows clear bias.',              exampleTr: 'Makale açık önyargı içeriyor.',                    type: 'noun' },
      { id: '6',  word: 'Coherent',      tr: 'Tutarlı',          def: 'Mantıksal olarak bağlantılı',                    example: 'She gave a coherent explanation.',           exampleTr: 'Tutarlı bir açıklama yaptı.',                      type: 'adjective' },
      { id: '7',  word: 'Deficiency',    tr: 'Eksiklik',         def: 'Gerekli bir şeyin yetersizliği',                 example: 'Vitamin D deficiency is common.',            exampleTr: 'D vitamini eksikliği yaygındır.',                  type: 'noun' },
      { id: '8',  word: 'Distinct',      tr: 'Belirgin, farklı', def: 'Açıkça ayırt edilebilen',                        example: 'The two ideas are quite distinct.',          exampleTr: 'İki fikir oldukça farklı.',                        type: 'adjective' },
      { id: '9',  word: 'Endeavor',      tr: 'Çaba',             def: 'Ciddi ve kararlı girişim',                       example: 'Learning a language is a worthy endeavor.',  exampleTr: 'Dil öğrenmek değerli bir çabadır.',                type: 'noun' },
      { id: '10', word: 'Feasible',      tr: 'Uygulanabilir',    def: 'Yapılması mümkün olan',                          example: 'The plan seems feasible.',                   exampleTr: 'Plan uygulanabilir görünüyor.',                    type: 'adjective' },
      { id: '11', word: 'Fragile',       tr: 'Kırılgan',         def: 'Kolayca zarar görebilen',                        example: 'Handle the fragile package carefully.',      exampleTr: 'Kırılgan paketi dikkatli taşı.',                   type: 'adjective' },
      { id: '12', word: 'Grasp',         tr: 'Kavramak',         def: 'Tam olarak anlamak',                             example: 'She quickly grasped the concept.',           exampleTr: 'Kavramı hızla kavradı.',                           type: 'verb' },
      { id: '13', word: 'Hazard',        tr: 'Tehlike',          def: 'Zarar verme potansiyeli olan şey',               example: 'Smoking is a health hazard.',                exampleTr: 'Sigara bir sağlık tehlikesidir.',                  type: 'noun' },
      { id: '14', word: 'Imply',         tr: 'İma etmek',        def: 'Doğrudan söylemeden anlatmak',                   example: 'His tone implied disapproval.',              exampleTr: 'Ses tonu onaylamadığını ima ediyordu.',            type: 'verb' },
      { id: '15', word: 'Inherent',      tr: 'Doğasında olan',   def: 'Bir şeyin özünde bulunan',                       example: 'Risk is inherent in every investment.',      exampleTr: 'Risk her yatırımın doğasında vardır.',             type: 'adjective' },
      { id: '16', word: 'Compromise',    tr: 'Uzlaşma',          def: 'Karşılıklı taviz vererek anlaşma',               example: 'They reached a fair compromise.',            exampleTr: 'Adil bir uzlaşmaya vardılar.',                     type: 'noun' },
      { id: '17', word: 'Notion',        tr: 'Kavram, fikir',    def: 'Bir şey hakkındaki inanç veya düşünce',          example: 'The notion of free time is changing.',       exampleTr: 'Boş zaman kavramı değişiyor.',                     type: 'noun' },
      { id: '18', word: 'Overwhelm',     tr: 'Bunaltmak',        def: 'Duygu veya iş yüküyle ezmek',                    example: 'She was overwhelmed with joy.',              exampleTr: 'Sevinçten bunaldı.',                               type: 'verb' },
      { id: '19', word: 'Plausible',     tr: 'Akla yatkın',      def: 'İnandırıcı görünen',                             example: 'That is a plausible explanation.',           exampleTr: 'Bu akla yatkın bir açıklama.',                     type: 'adjective' },
      { id: '20', word: 'Reinforce',     tr: 'Pekiştirmek',      def: 'Daha güçlü hale getirmek',                       example: 'Practice reinforces learning.',              exampleTr: 'Pratik öğrenmeyi pekiştirir.',                     type: 'verb' },
      { id: '21', word: 'Scarce',        tr: 'Kıt',              def: 'Az bulunan, yetersiz',                           example: 'Clean water is scarce in the region.',       exampleTr: 'Bölgede temiz su kıt.',                            type: 'adjective' },
      { id: '22', word: 'Subtle',        tr: 'İnce, belli belirsiz', def: 'Fark edilmesi güç olan',                     example: 'There is a subtle difference between them.', exampleTr: 'Aralarında ince bir fark var.',                    type: 'adjective' },
      { id: '23', word: 'Tangible',      tr: 'Somut',            def: 'Dokunulabilir, elle tutulur',                    example: 'We need tangible results.',                  exampleTr: 'Somut sonuçlara ihtiyacımız var.',                 type: 'adjective' },
      { id: '24', word: 'Underlying',    tr: 'Altta yatan',      def: 'Görünenin arkasındaki temel',                    example: 'The underlying cause is stress.',            exampleTr: 'Altta yatan neden stres.',                         type: 'adjective' },
      { id: '25', word: 'Versatile',     tr: 'Çok yönlü',        def: 'Birçok işe uyum sağlayabilen',                   example: 'She is a versatile musician.',               exampleTr: 'Çok yönlü bir müzisyen.',                          type: 'adjective' },
      { id: '26', word: 'Withstand',     tr: 'Dayanmak',         def: 'Bir etkiye karşı koymak',                        example: 'The bridge can withstand earthquakes.',      exampleTr: 'Köprü depremlere dayanabilir.',                    type: 'verb' },
      { id: '27', word: 'Accumulate',    tr: 'Birikmek',         def: 'Zamanla artarak toplanmak',                      example: 'Dust accumulated on the shelves.',           exampleTr: 'Raflarda toz birikti.',                            type: 'verb' },
      { id: '28', word: 'Brevity',       tr: 'Kısalık',          def: 'Kısa ve öz olma durumu',                         example: 'Brevity is the soul of wit.',                exampleTr: 'Kısalık zekanın ruhudur.',                         type: 'noun' },
      { id: '29', word: 'Cease',         tr: 'Durmak, kesmek',   def: 'Sona ermek veya erdirmek',                       example: 'The rain finally ceased.',                   exampleTr: 'Yağmur sonunda durdu.',                            type: 'verb' },
      { id: '30', word: 'Dispute',       tr: 'Anlaşmazlık',      def: 'Taraflar arası uyuşmazlık',                      example: 'They settled the dispute peacefully.',       exampleTr: 'Anlaşmazlığı barışçıl çözdüler.',                  type: 'noun' },
      { id: '31', word: 'Eligible',      tr: 'Uygun, hak sahibi', def: 'Gerekli şartları taşıyan',                      example: 'You are eligible for a discount.',           exampleTr: 'İndirim için uygunsun.',                           type: 'adjective' },
      { id: '32', word: 'Fierce',        tr: 'Şiddetli, sert',   def: 'Yoğun ve güçlü',                                 example: 'Competition in the market is fierce.',       exampleTr: 'Piyasadaki rekabet şiddetli.',                     type: 'adjective' },
      { id: '33', word: 'Glimpse',       tr: 'Kısa bakış',       def: 'Bir anlık görme',                                example: 'I caught a glimpse of the sea.',             exampleTr: 'Denizi bir anlığına gördüm.',                      type: 'noun' },
      { id: '34', word: 'Immense',       tr: 'Muazzam',          def: 'Son derece büyük',                               example: 'The project requires immense effort.',       exampleTr: 'Proje muazzam çaba gerektiriyor.',                 type: 'adjective' },
      { id: '35', word: 'Jeopardize',    tr: 'Tehlikeye atmak',  def: 'Riske sokmak',                                   example: 'Do not jeopardize your career.',             exampleTr: 'Kariyerini tehlikeye atma.',                       type: 'verb' },
      { id: '36', word: 'Keen',          tr: 'Hevesli, keskin',  def: 'İstekli; güçlü (algı)',                          example: 'She has a keen eye for detail.',             exampleTr: 'Detaylara karşı keskin bir gözü var.',             type: 'adjective' },
      { id: '37', word: 'Linger',        tr: 'Oyalanmak',        def: 'Gerekli olandan uzun kalmak',                    example: 'The smell lingered for hours.',              exampleTr: 'Koku saatlerce kaldı.',                            type: 'verb' },
      { id: '38', word: 'Mediocre',      tr: 'Vasat',            def: 'Ortalama, sıradan kalitede',                     example: 'The film received mediocre reviews.',        exampleTr: 'Film vasat eleştiriler aldı.',                     type: 'adjective' },
      { id: '39', word: 'Nurture',       tr: 'Beslemek, yetiştirmek', def: 'Gelişimine destek olmak',                   example: 'Parents nurture their children.',            exampleTr: 'Ebeveynler çocuklarını yetiştirir.',               type: 'verb' },
      { id: '40', word: 'Optimal',       tr: 'En uygun',         def: 'Mümkün olan en iyi',                             example: 'Find the optimal solution.',                 exampleTr: 'En uygun çözümü bul.',                             type: 'adjective' },
    ],
  },
];

export async function loadDueWords(): Promise<StudyWord[]> {
  try {
    const now = Date.now();
    const keys = await AsyncStorage.getAllKeys();
    const srsKeys = keys.filter(k => k.startsWith('srs_'));
    if (srsKeys.length === 0) return [];

    const srsEntries = await AsyncStorage.multiGet(srsKeys);
    const dueWords: StudyWord[] = [];

    for (const [srsKey, val] of srsEntries) {
      if (!val) continue;
      const listId = srsKey.replace('srs_', '');
      const srsData: Record<string, { nextReviewTime: number }> = JSON.parse(val);
      const words = await loadStudyWords(listId);

      for (const w of words) {
        const srs = srsData[w.id];
        if (srs && srs.nextReviewTime <= now) {
          dueWords.push({ ...w, _listId: listId });
        }
      }
    }
    return dueWords;
  } catch {
    return [];
  }
}

export type FavRef = { listId: string; wordId: string };

export async function loadFavRefs(): Promise<FavRef[]> {
  try {
    const raw = await AsyncStorage.getItem('fav_words');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleFav(listId: string, wordId: string): Promise<boolean> {
  const favs = await loadFavRefs();
  const idx = favs.findIndex(f => f.listId === listId && f.wordId === wordId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push({ listId, wordId });
  await AsyncStorage.setItem('fav_words', JSON.stringify(favs));
  return idx < 0; // yeni durum: favori mi
}

export async function loadFavWords(): Promise<StudyWord[]> {
  const favs = await loadFavRefs();
  if (favs.length === 0) return [];
  const byList = new Map<string, string[]>();
  for (const f of favs) {
    if (!byList.has(f.listId)) byList.set(f.listId, []);
    byList.get(f.listId)!.push(f.wordId);
  }
  const result: StudyWord[] = [];
  for (const [listId, wordIds] of byList) {
    const words = await loadStudyWords(listId);
    for (const w of words) {
      if (wordIds.includes(w.id)) result.push({ ...w, _listId: listId });
    }
  }
  return result;
}

export async function loadStudyWords(listId: string | undefined): Promise<StudyWord[]> {
  if (!listId) return DEFAULT_LISTS[0].words;
  if (listId === '_due') return loadDueWords();
  if (listId === '_fav') return loadFavWords();

  const def = DEFAULT_LISTS.find(l => l.id === listId);
  const defWords = def ? def.words : [];

  // Default listeye kullanıcı tarafından eklenen kelimeler de dahil edilir;
  // custom listelerde ise tek kaynak words_{listId}'dir
  try {
    const raw = await AsyncStorage.getItem(`words_${listId}`);
    if (!raw) return defWords;
    const custom: Record<string, string>[] = JSON.parse(raw);
    const customWords = custom.map((w, i) => ({
      id: w.id || String(i),
      word: w.word || '',
      tr: w.tr || '',
      def: w.def || '',
      example: w.example || '',
      exampleTr: w.exampleTr || '',
      type: w.type || 'noun',
    }));
    return [...defWords, ...customWords];
  } catch {
    return defWords;
  }
}
