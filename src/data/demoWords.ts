import AsyncStorage from '@react-native-async-storage/async-storage';

export type StudyWord = {
  id: string;
  word: string;
  tr: string;
  def: string;
  example: string;
  exampleTr: string;
  type: string;
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
];

export async function loadStudyWords(listId: string | undefined): Promise<StudyWord[]> {
  if (!listId) return DEFAULT_LISTS[0].words;
  const def = DEFAULT_LISTS.find(l => l.id === listId);
  if (def) return def.words;

  try {
    const raw = await AsyncStorage.getItem(`words_${listId}`);
    if (!raw) return DEFAULT_LISTS[0].words;
    const custom: Record<string, string>[] = JSON.parse(raw);
    return custom.map((w, i) => ({
      id: w.id || String(i),
      word: w.word || '',
      tr: w.tr || '',
      def: w.def || '',
      example: w.example || '',
      exampleTr: w.exampleTr || '',
      type: w.type || 'noun',
    }));
  } catch {
    return DEFAULT_LISTS[0].words;
  }
}
